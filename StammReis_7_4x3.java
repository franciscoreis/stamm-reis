package AppClasses.BidemensionalCodes;

public class StammReis_7_4x3 {

	
	static final int[] rotateLeft = {0,21,16,11,6,1,22,17,12,7,2,23,18,13,8,3,24,19,14,9,4,25,20,15,10,5};
	static final int[] bitToColRow = {0,13,17,9,20,24,6,2,14,18,7,10,22,11,3,12,19,8,15,23,16,4};

    static final int maxMiddle = 1 << 12;
    static final int maxTotal = maxMiddle * 2;

	static final String codeLetters = "ABC";

	static public String decodeImage(String tableBW) //returns JSON
	{
		
			  if(tableBW == null || tableBW.length() != 25)
				return "{\"error\":\"input must be 25 in length\"}";
			   if(tableBW.charAt(0) == '0' || tableBW.charAt(0) == '1')
				   {
				   String tableBWnew = "";
				   for(int i = 0; i < 25; i++)
					   tableBWnew +=  tableBW.charAt(i) == '0' ? 'w' : 'b';
				   tableBW = tableBWnew;
				   }
			  
			  String s = "Table colors: " + tableBW + "<br><br>";

			  String cornerBackOrWhite = placeCornerTopUp(tableBW);
			  if(cornerBackOrWhite == null)
				  s += "<b style='color:red'>ERROR: no unique corner color found</b>";
			  else
				  {
				  tableBW = cornerBackOrWhite.substring(2);
				  boolean topLeftCornerIsBlack = tableBW.charAt(0) == 'b';
				  s += "Corner = " + (topLeftCornerIsBlack ? "BLACK" : "WHITE");
				  int iCorner = cornerBackOrWhite.charAt(0) - '0';
				  if (iCorner > 0)
					  s += " (rotated right <b>" + (90 * iCorner) + "deg</b>)";
				  
				  //no need to remove corners
					  
				  String bitsOrdered = "";
				  for(int i = 1; i <= 21; i++)	  
					if(bitToColRow[i] % 2 == 0) //
						  bitsOrdered = (tableBW.charAt(bitToColRow[i]-1) == 'b' ? 1 : 0) + bitsOrdered;
					  else
						  bitsOrdered = (tableBW.charAt(bitToColRow[i]-1) == 'b' ? 0 : 1) + bitsOrdered;
					  
				  DecodeBitsOrderedRESULT decodedBits = decodeBitsOrdered(bitsOrdered, topLeftCornerIsBlack); 		  
					  
				  s += "<br><br>Bits Ordered = " + bitsOrdered
				    + "<br>Parity bits = " + decodedBits.parityBits[2] + decodedBits.parityBits[1] + decodedBits.parityBits[0]
				    + "<br>Binary code = " + decodedBits.codeBinary
				    + "<br>Code = " + decodedBits.code
				    + "<br>";

				  if(decodedBits.posFailed[0] + decodedBits.posFailed[1] + decodedBits.posFailed[2]  == 0)
					  s += "<br><br><b style='color:green'>PARITY SUCCESS</b>";
				   else
					{
					  int numberSuccess = 0;
					  int noCorrectionPossible = 0;
					  for(int letter = 0; letter < 3; letter++)	  
					  if(decodedBits.posFailed[letter] != 0)
					  {
					  s += "<br><b style='color:red'>PARITY FAILED: position " + codeLetters.charAt(letter) + decodedBits.posFailed[letter] + "</b>";
					  if(decodedBits.posFailed[letter] > 7) 
						  noCorrectionPossible++;
					  else 
						  {
						  if(decodedBits.failedPosition[letter].replaceAll("0", "").length() == 1) 
							  numberSuccess++; //parity bit error
						  int posFailed = 21 - letter*7 - decodedBits.posFailed[letter];
						  int errorBit = bitsOrdered.charAt(posFailed);
						  bitsOrdered = bitsOrdered.substring(0, posFailed) 
						  				+ (errorBit == '1'? '0' : '1')
						  				+ bitsOrdered.substring(posFailed + 1);
						  }
					  }

					  if(numberSuccess > 0)
						  s += "<br><br><b style='color:#440'>"+numberSuccess+" NUMBER SUCCESS(ES)</b> (parity bit corrupted - if one error)";
					  if(noCorrectionPossible > 0)
						  s += "<br><b style='color:red'>"+noCorrectionPossible+" NO CORRECTION(S) POSSIBLE ("+decodedBits.posFailed+" > 7)</b>";

					  decodedBits = decodeBitsOrdered(bitsOrdered, topLeftCornerIsBlack);
						
					  s += "<br><br>Bits Corrected = " + bitsOrdered;
					  s += "<br>Parity bits = " + decodedBits.parityBits;
					  s += "<br>Binary code = " + decodedBits.codeBinary;
					  s += "<br>Code = " + decodedBits.code;
					  if(decodedBits.posFailed[0] + decodedBits.posFailed[1] + decodedBits.posFailed[2] == 0)
						  s += "<br><br><b style='color:#440'>NUMBER SUCCESS (correct if max one error per ABC)";
					   else
						  s += "<br><br><b style='color:red'>PARITY CORRECTION FAILED";

					}
				  return "{\"code\":"+decodedBits.code
						  + ",\"rotation\":"+(90 * iCorner)
						  + ",\"comments\":\""+s+"\"}";
				  
				  }
			  
			 return "{\"error\":\""+s+"\"}";
			  
			  
		};
	//-------------------------------------------------------------------
	static String placeCornerTopUp(String bwbwbw) 
		 {

		  for (int i = 0; i < 4; i++)
		    if(bwbwbw.charAt(0) != bwbwbw.charAt(4)
		  	  && bwbwbw.charAt(4) == bwbwbw.charAt(20)
		  	  && bwbwbw.charAt(4) == bwbwbw.charAt(24))
		  	  return i + " " + bwbwbw;
		     else  
		  	  {
		  	   char[] rotate = new char[25];
		  	   int bwbwbwLength = bwbwbw.length();
		  	   for(int num = 1; num <= bwbwbwLength; num++)
		  		 rotate[rotateLeft[num]] = bwbwbw.charAt(num-1);
		  	   bwbwbw = "";	 
		  	   for(int num = 1; num <= bwbwbwLength; num++)
		  			 bwbwbw += rotate[num];
		  	  }
		  	  
		  return null;
		  	
		  }
//----------------------------------------------
static int checkParity(String codeBinary, int nextParityBit)
	  {
		  int bitPos = 1;
		  while(nextParityBit > 1)
			  {
			  nextParityBit /= 2;
			  bitPos++;
			  }
		  int par = 0;
		  for(int b = 1; b <= codeBinary.length(); b++)
			  {
			  String binary = Integer.toBinaryString(b);
			  if(bitPos <= binary.length() && binary.charAt(binary.length()-bitPos) == '1')
				 if(b <= codeBinary.length() && codeBinary.charAt(codeBinary.length() - b) == '1')
				   par = 1 - par;
			  }
		  return par;
	  }
//----------------------------------------------
static DecodeBitsOrderedRESULT decodeBitsOrdered(String totalBitsOrdered, boolean topLeftCornerIsBlack) 		  
	  {
	  //remove parity bits
	  DecodeBitsOrderedRESULT result = new DecodeBitsOrderedRESULT();
	  
	  result.codeBinary = "";
	  for(int letter = 0; letter < 3; letter++)
	  {
	 	  String bitsOrdered = totalBitsOrdered.substring(21-(letter+1)*7, 21-letter*7);

		  int nextParityBit = 1;
		  for(int i = 1; i <= 7; i++)
			  if(i == nextParityBit)
				  {
				  result.parityBits[letter] = bitsOrdered.charAt(bitsOrdered.length() - i) + result.parityBits[letter];
				  nextParityBit *= 2;
				  }
			  else 
				  result.codeBinary = bitsOrdered.charAt(bitsOrdered.length() - i) + result.codeBinary;

		  result.code = Integer.parseInt(result.codeBinary, 2);
		  if(topLeftCornerIsBlack)
			  result.code += maxMiddle;

		  nextParityBit = 1;
		  boolean parityFailed = false;
		  for(int i = 0; i < 5; i++)
			  {
			  result.failedPosition[letter] = checkParity(bitsOrdered, nextParityBit) + result.failedPosition[letter];
			  nextParityBit *= 2;
			  }

	  }//for letter
	  
	  return result;
}
//--------------------------------------------------------
public static void test() 
{
	String resultJson = StammReis_7_4x3.decodeImage("wwwwbwwwbwwwwwwbbbwbbwbbb");
	assert(resultJson.indexOf("code:1234,") != -1);
	
	resultJson = StammReis_7_4x3.decodeImage("0000100010000001110110111");
	assert(resultJson.indexOf("code:1234,") != -1);
	
}

/*
	
	  result.posFailed[letter] = parseInt(result.failedPosition[letter], 2)
 
 */
//----------------------------------------------
}//class

class DecodeBitsOrderedRESULT
{
	int code;
	String codeBinary;
	String[] parityBits = {"","",""};
	int[] posFailed = {0,0,0};
	String[] failedPosition = {"","",""};
}

