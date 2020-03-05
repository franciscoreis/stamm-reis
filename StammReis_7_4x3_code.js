"use-strict"

var StammReis_code_7_4x3 = (function () {
    
	  // Keep this variable private inside this closure scope

	  const maxMiddle = 1 << 12
	  const maxTotal = maxMiddle * 2
	  
	  const codeLetters = "ABC"

	  const dxdy = "6em"
	  let showFinalMarker = false
		  
	  //var bitToColRow=[0,12,18,9,22,15,6,2,13,19,7,23,10,16,3,14,17,8,24,20,11,4];
	  const bitToColRow=[0,13,17,9,20,24,6,2,14,18,7,10,22,11,3,12,19,8,15,23,16,4];
//	  var colRowToABCn=[7,14,21,6,10,17,3,12,20,1,8,15,5,13,16,2,9,19,4,11,18];
	  const colRowToABCn=[7,14,21,6,10,17,3,11,13,15,1,8,18,20,2,9,16,4,12, 19,5];
	  
	  const rotateLeft=[0,21,16,11,6,1,22,17,12,7,2,23,18,13,8,3,24,19,14,9,4,25,20,15,10,5];
	  
	  
	  // Expose these functions via an interface while hiding
	  // the implementation of the module within the function() block

	  //private
	  function parity(codeBinary, nextParityBit)
	  {
		  let bitPos = 1
		  while(nextParityBit > 1)
			  {
			  nextParityBit /= 2
			  bitPos++
			  }
		  let par = 0
		  for(let b = 1; b <= codeBinary.length; b++)
			  {
			  let binary = (b).toString(2)
			  if(bitPos <= binary.length && binary.charAt(binary.length-bitPos) == '1')
				 if(b <= codeBinary.length && codeBinary.charAt(codeBinary.length - b) == '1')
				   par = 1 - par
			  }
		  return par
		  
	  }
	  //-----------------------------------
	  function checkParity(codeBinary, nextParityBit)
	  {
		  let bitPos = 1
		  while(nextParityBit > 1)
			  {
			  nextParityBit /= 2
			  bitPos++
			  }
		  let par = 0
		  for(let b = 1; b <= codeBinary.length; b++)
			  {
			  let binary = (b).toString(2)
			  if(bitPos <= binary.length && binary.charAt(binary.length-bitPos) == '1')
				 if(b <= codeBinary.length && codeBinary.charAt(codeBinary.length - b) == '1')
				   par = 1 - par
			  }
		  return par
	  }
	  //----------------------------------------------
	  function decodeBitsOrdered(totalBitsOrdered, topLeftCornerIsBlack) 		  
	  {
	  //remove parity bits
	  let result = {}
	  result.codeBinary = ""
	  result.parityBits = ["","",""]
	  result.posFailed = [0,0,0]
	  for(let letter = 0; letter < 3; letter++)	  
	  {
	  let bitsOrdered = totalBitsOrdered.slice(21-(letter+1)*7, 21-letter*7)
		  
	  let nextParityBit = 1
	  for(let i = 1; i <= 7; i++)
		  if(i == nextParityBit)
			  {
			  result.parityBits[letter] = bitsOrdered.charAt(bitsOrdered.length - i) + result.parityBits[letter]
			  nextParityBit *= 2
			  }
		  else 
			  result.codeBinary = bitsOrdered.charAt(bitsOrdered.length - i) + result.codeBinary

	  result.code = parseInt(result.codeBinary, 2);
	  if(topLeftCornerIsBlack)
		  result.code += maxMiddle
	
		  nextParityBit = 1
		  let parityFailed = false
		  result.failedPosition = ["","",""]
		  for(let i = 0; i < 5; i++)
			  {
			  result.failedPosition[letter] = checkParity(bitsOrdered, nextParityBit) + result.failedPosition[letter]
			  nextParityBit *= 2
			  }

	  result.posFailed[letter] = parseInt(result.failedPosition[letter], 2)
	  }//for letter
	  
	  return result
	  }
	  //-------------------------------------------------
	  function placeCornerTopUp(bwbwbw, rotateToFind) 
	  {
	  let maxR = rotateToFind ? 4 : 1
	  for (let i = 0; i < maxR ; i++)
	    if(bwbwbw.charAt(0) != bwbwbw.charAt(4)
	  	  && bwbwbw.charAt(4) == bwbwbw.charAt(20)
	  	  && bwbwbw.charAt(4) == bwbwbw.charAt(24))
	  	  return [i,bwbwbw]
	     else  
	  	  {
	  	   let rotate = []
	  	   let bwbwbwLength = bwbwbw.length
	  	   for(let num = 1; num <= bwbwbwLength; num++)
	  		 rotate[rotateLeft[num]] = bwbwbw.charAt(num-1)
	  		 bwbwbw = ""	 
	  		 for(let num = 1; num <= bwbwbwLength; num++)
	  			 bwbwbw += rotate[num]
	  	  }
	  	  
	  return false
	  	
	  }
	  //-------------------------------------------------
	  return {
		  
		  showSelector: function(selector, code) 
		  {
			  
			  
			  if(code === undefined)
				  code = 0;
			  else 
				  try
			  		{
					  code = parseInt(""+code)
			  		}
			  catch(e)
			  		{
				    code = 0
			  		}
			  
			  
			  let s = "<br>Code <input type='number' value='"+code+"' onChange='StammReis_code_7_4x3.showSelector(\""+selector+"\",this.value)' style='width:6em'> &nbsp; 0 -> " + (maxTotal - 1)	  
				
			  let codeProcessed = StammReis_code_7_4x3.processCode(code, true)
			  if(codeProcessed.error)
				  {
					$(selector).html(s + "<br><br>" + codeProcessed.error + "<br>");  
					return
				  }
					  
				  
			  	  let num = 0;
			  	  numBit = 1
				  let rcNum = 5
				  s += "<br><br>" 
				  	  + "<table><tr><td class='thin_border_SR_7_4x3' style='padding:0em;background-color:#fff'>" 
				  	    + "<table><tr><td class='thick_border_SR_7_4x3' style='padding:0em;background-color:#fff'>" 
				  		  + "<table class='table_encode_SR_7_4x3' border='1'>"
				  let currentLetter = 0

				  for(let row = 1; row <= rcNum; row++)
				  {
					  s += "<tr>"
					  for(let col = 1; col <= rcNum; col++)
					  {
						 num++
						 let blackNotWhite = codeProcessed.finalCodingLetters.charAt(row * 5 + col -6) == 'b';
						 let charOfBit = ""
						 let numBitRepresented = ""
						 if((col == 1 || col == rcNum) && (row == 1 || row == rcNum))
						 {
						 }
						 else
							 {
							 let abcN = colRowToABCn[numBit - 1] - 1
							 numBitRepresented = codeLetters.charAt(abcN / 7) + (abcN % 7 + 1)
							 charOfBit = codeProcessed.stammReisCode.charAt(codeProcessed.stammReisCode.length - colRowToABCn[numBit-1])
							 numBit++
							 }
						 
							 						 
						 s += "<td style='width:"+dxdy+";height:"+dxdy+";background-color:"+(blackNotWhite ? "#000" : "#fff")+";color:"+(blackNotWhite ? "#fff" : "#000")+"'>"
						 s += "<table>"
							 + "<tr><td style='font-size:200%'><p class='text_SR_7_4x3'>"+charOfBit+"</p></td></tr>"
							 + "<tr><td><p class='text_SR_7_4x3'>"+numBitRepresented+"</p></td></tr>" 
					//	 s += "<tr><td>&nbsp;"+col+","+row+"&nbsp;</td><td>&nbsp;"+num+"</td></tr>"
						     + "</table>" 
						 s += "</td>"
					  }  
					  s += "</tr>"
				  }
					  
				  s += "</table>"	 
					  + "</td></tr></table>"
					  + "</td></tr></table>"
				  
					  s += "<br><br>Code in binary: " + codeProcessed.codeBinary + " (" + codeProcessed.codeMiddle + ")"
					  s += "<br><br>Hamming-code: " + codeProcessed.stammReisCodeHTML
					  s += "<br>Parity bits: " + codeProcessed.parityBits
					  s += "<br><br>StammReis-code: " + codeProcessed.finalCoding
					  s += "<br><br><button onClick='StammReis_code_7_4x3.decodeShow(\""+selector+"\",\""+codeProcessed.finalCodingLetters+"\",\""+code+"\")' >Decode "+codeProcessed.finalCodingLetters+"</button>"  
					  s += "<br><br><button onClick='StammReis_code_7_4x3.explainEncode(\""+selector+"\",\""+code+"\")' >Encode Explanation</button>"  
					  s += " &nbsp; <button onClick='StammReis_code_7_4x3.hammingDistance(\""+selector+"\", "+code+", 0, 1000)' >Hamming distance</button>"  
					  s += "<br><br><button onClick='StammReis_code_7_4x3.toggleShowFinalMarker()' >Toggle show final marker</button>"
					  
			$(selector).html(s);  
				  
			StammReis_code_7_4x3.toggleShowFinalMarker(showFinalMarker)  
	      },
	     //--------------------------------------------------------------------------------
		  toggleShowFinalMarker: function (show)
		  {
	      let sfm = show !== undefined ? show : !showFinalMarker; 
	      showFinalMarker=sfm;
	      $(".thin_border_SR_7_4x3")
	         .css("background-color", sfm ? "#000":"#fff")
	         .css("padding", sfm ? "0.7em": "0em");
	      $(".thick_border_SR_7_4x3")
	         .css("padding", sfm ? dxdy: "0em");
	      $(".table_encode_SR_7_4x3").attr("border", sfm ? "0" : "1")
	      if(sfm)
	    	  $(".text_SR_7_4x3").hide()
	      else
	    	  $(".text_SR_7_4x3").show()
	    	  
		  },
	      //--------------------------------------------------------------------------------
		  processCode: function (code, addHTML)
		  {
		  let result = {}
		  
		  result.blackNotWhiteUpperLeftCorner = false;
		  
		  result.codeMiddle = code;
		  if(code >= maxMiddle)
			  {
			  result.codeMiddle = code - maxMiddle
			  result.blackNotWhiteUpperLeftCorner = true
			  }

		  
		  result.codeBinary = (result.codeMiddle).toString(2)
		  if(result.codeBinary.length > 12)
			  {
			  result.error = "<br><br><b style='color:red'>CODE IS TOO BIG</b>"
			  return result;
			  }
		  if(result.codeBinary.length < 12)
			  result.codeBinary =  "0".repeat(12 - result.codeBinary.length) + result.codeBinary
		
		  result.stammReisCodeZeros = ""
		  result.stammReisCode = ""
		  result.stammReisCodeHTML = ""
		  result.parityBits = ""		  
		  
		  for(let letter = 0; letter < 3; letter++)	  
		  {  
		  let codeBinary = result.codeBinary.slice(12-(letter+1)*4, 12-letter*4)
			  
		  let letterStammReisCodeZeros = ""
		  
		  let numBit = 1
		  let nextParityBit = 1
		  for(let i = 1; i <= 7; i++)
			  if(i == nextParityBit)
				  {
				  letterStammReisCodeZeros = "0" + letterStammReisCodeZeros
				  nextParityBit *= 2
				  }
			  else
				  {
				  letterStammReisCodeZeros = codeBinary.charAt(4 - numBit) + letterStammReisCodeZeros
				  numBit++
				  }
				
		  result.stammReisCodeZeros = letterStammReisCodeZeros + result.stammReisCodeZeros
			  
		  nextParityBit = 1
		  numBit = 1
		  for(let i = 1; i <= 7; i++)
			  if(i == nextParityBit)
				  {
				  let par = parity(letterStammReisCodeZeros, nextParityBit)
				  result.stammReisCode = par + result.stammReisCode
				  result.parityBits = par + result.parityBits
				  if(addHTML)
					  result.stammReisCodeHTML = "<b style='color:blue'>" + par + "</b>"+ result.stammReisCodeHTML
				  nextParityBit *= 2
				  }
			  else
				  {
				  let bit = codeBinary.charAt(4 - numBit)
				  result.stammReisCode = bit + result.stammReisCode
				  result.stammReisCodeHTML = bit + result.stammReisCodeHTML
				  numBit++
				  }
		  }//for letter
		  
		  let finalCoding = ""
		  let finalCodingLetters = ""
		  
		  let num = 0;
	  	  numBit = 1
		  let rcNum = 5

		  for(let row = 1; row <= rcNum; row++)
		  {
			  for(let col = 1; col <= rcNum; col++)
			  {
				 num++
				 let charOfBit = ""
				 let numBitRepresented = ""
				 let blackNotWhite = false;
				 if((col == 1 || col == rcNum) && (row == 1 || row == rcNum))
				 {
				 if(col == 1 && row == 1) 	 
					 blackNotWhite = result.blackNotWhiteUpperLeftCorner
				  else
					 blackNotWhite = !result.blackNotWhiteUpperLeftCorner
				 }
				 else
					 {
					 blackNotWhite = num % 2 == 1
					 let abcN = colRowToABCn[numBit - 1] - 1
					 numBitRepresented = codeLetters.charAt(abcN / 7) + (abcN % 7 + 1)
					 charOfBit = result.stammReisCode.charAt(result.stammReisCode.length - colRowToABCn[numBit-1])
					 if(charOfBit == '1')
						 blackNotWhite = !blackNotWhite
					 numBit++
					 }
				 
				 finalCoding += blackNotWhite ? "1" : "0"
				 finalCodingLetters += blackNotWhite ? "b" : "w"
			  }//col
		  }//row
					 
					 
		  result.finalCoding = finalCoding
		  result.finalCodingLetters = finalCodingLetters
			  
		  return result
	  },
	  //-------------------------------------------------
	      hammingDistance: function (selector, code, startCode, endCode)
	      {
	    	  startCode = parseInt("" + startCode)
	    	  endCode = parseInt("" + endCode)
	    	  
	    	  if(startCode > endCode)
	    		  {
	    		  let h = startCode
	    		  startCode = endCode
	    		  endCode = h
	    		  }
	    	  
	    	  let codes = []
	    	  for(let i = startCode; i <= endCode; i++)
	    		codes[i] = StammReis_code_7_4x3.processCode(i).stammReisCode
	    	  
	    	  let minD = 1000
	    	  let maxD = 0
	    	  let averageD = 0
	    	  let totNum = 0
	    	  
	    	  let len = codes[startCode].length
	    	  for(let n = startCode; n < endCode; n++)
	    		  for(let m = n + 1; m <= endCode; m++)
	    			  {
	    			  let d = 0
	    			  for(let i = 0; i < len; i++)
	    				 if(codes[n].charAt(i) != codes[m].charAt(i))
	    					 d++
	    			   if(n < maxMiddle ^ m < maxMiddle)
	    				   d += 4 // 4 corners are different
	    				   
	    			   if(minD > d)
	    				   minD = d
	    			   if(maxD < d)
	    				   maxD = d
	    			   averageD += d	    
	    			   totNum++
	    			  }
	    	  
	    	  averageD = averageD / totNum

			  let s = "<br>" 
				  + "FROM " + startCode + " TO " + endCode
					  + "<br> Min distance = " + minD
					  + "<br> Max distance = " + maxD
					  + "<br> Average distance<br>" + averageD
				  + "<br><br>From <input type='number' value='"+startCode+"' style='width:8em'>" 
				  + "<br><button onClick='StammReis_code_7_4x3.hammingDistance(\""+selector+"\", "+code+", $(this).prevAll(\"input\").val(), $(this).nextAll(\"input\").val())' >Hamming distance</button>"  
				  + "<br>To <input type='number' value='"+endCode+"' style='width:8em'>" 
				  + "<br><br><button onClick='StammReis_code_7_4x3.showSelector(\""+selector+"\",\""+code+"\")' >Encode "+code+"</button>"
				  + "<br>"
			  
			  $(selector).html(s);  

	    	  
	      },
	      //-------------------------------------------------
	      decodeShow: function (selector, finalCoding, code)
	      {
			  
	    	  let rcNum = 5
	    	  
	    	  let s = "<br>"
				 + "<button onClick='StammReis_code_7_4x3.rotateLeft($(this).nextAll(\"table\")[0],$(this).nextAll(\"div\")[0])' >Rotate image left</button> &nbsp; click squares to invert" 

			  s += "<br><br><table border='1' style='cursor:pointer'>"
			  let num = 0
			  let numBit = 1
				  for(let row = 1; row <= rcNum; row++)
				  {
					  s += "<tr>"
					  for(let col = 1; col <= rcNum; col++)
					  {
						  
					     let numBitRepresented = ""
							 if((col == 1 || col == rcNum) && (row == 1 || row == rcNum))
							 {
								 //corners
							 }
							 else
								 {
								 let abcN = colRowToABCn[numBit - 1] - 1
								 numBitRepresented = codeLetters.charAt(abcN / 7) + (abcN % 7 + 1)
								 numBit++
								 }
						  
						  let bw = finalCoding.charAt(num)
						 s += "<td bw='"+bw+"' onClick='let bw = $(this).attr(\"bw\"); this.style.backgroundColor = bw == \"b\" ? \"#fff\":\"#000\";this.style.color = bw == \"b\" ? \"#000\":\"#fff\"; $(this).attr(\"bw\", bw == \"b\" ? \"w\":\"b\")' style='width:3em;height:3em;background-color:"+(bw == 'b' ? "#000;color:#fff" : "#fff;color:#000") +"'>" 
						 num++
						 s += numBitRepresented + "</td>"
					  }  
					  s += "</tr>"
				  }
					  
					  
				  s += "</table>"	  
				  s += "<br><br>" 
					  + "<button onClick='StammReis_code_7_4x3.decodeImage($(this).prevAll(\"table\")[0], true, true, true, $(this).nextAll(\"div\")[0])' >Decode Image</button>" 
					  + "<button onClick='StammReis_code_7_4x3.showSelector(\""+selector+"\",\""+code+"\")' >Encode "+code+"</button>"
					  + "<br><br><div></div><br>"
				  
		$(selector).html(s);  
	      },
//-------------------------------------------------
explainEncode: function(selector, code) 
{
let s = "<br>"
	+ "<button onClick='StammReis_code_7_4x3.showSelector(\""+selector+"\",\""+code+"\")' >Encode "+code+"</button><br><br>"
	    		
s += `It is worth to read our inspiration: <a target='_new' href='https://en.wikipedia.org/wiki/Hamming_code'>Hamming_code</a>
<br><br>
Our Stamm-Reis encoding algorythm target a high
<br>number of bits with limited error checking.
<br>We also aim to have nice patterns in first codes.
<br><br>
We stick to two colors so that any printer can be used.
<br>We use the 4 corner squares/bits for orientation
<br>(the bit that is different from the other 3 marks, for example, the top left corner)
<br>so humans can also easily detect markers' orientation
<br>(2 variations using 4 bits is bad but useful).
<br><br>
From the other 21 bits using 3 groups (ABC)
<br>of 7/4 bits Hamming coding we have
<br><br>
   C &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; B &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; A
<br>
xxx_x__ &nbsp; xxx_x__ &nbsp; xxx_x__
<br><br> 4 bits x for data &nbsp; &nbsp; 3 bits _ for error detection
<br><br>
3 x 4 bits = 12 bits = 4096 combinations
<br>
2 types of corners =  4096 x 2 = 8192
<br><br>
To avoid in first code to have an empty marker we initialize with
<br>10101
<br>01010
<br>10101
<br>01010
<br>10101
<br>and invert when the bit to represent is 1.
<br><br>To stay simmetrical and nice in first codes we start
<br><br>filling the 21 squares by the center and go outwards:
<br>   A7 B7 C7
<br>A6 B3 C3 A3 B4
<br>B6 C1 A1 B1 C4
<br>C6 A2 B2 C2 A4
<br>   B5 C5 A5  
<br><br><br>
Stamm-Reis code tries to better use all the bits and 
<br>
make it recognizable (orientation) and nice for humans.
`
$(selector).html(s);  
	    	  
},
//-------------------------------------------------
decodeImage: function(table, rotateToFind, tryToCorrect, generateFullInfo, div) 
{
	  
	  let decodedBits 
	  let s = "<br>";
	  
	  let tableBW = ""
	  if(table.nodeName  === "TABLE")
	    for(let r = 0; r < table.rows.length; r++)
		  {
		  let row = table.rows[r];
		  for(let c = 0; c < row.cells.length; c++)
			  tableBW += $(row.cells[c]).attr("bw")
		  }
	  else
		  for(let row = 0; row < 5; row++)
			  for(let col = 0; col < 5; col++)
				  tableBW += table[row][col] == 0 ? "w" : "b" 
				
	  if(generateFullInfo)				  
		  s += "Table colors: " + tableBW + "<br><br>";

	  let cornerBackOrWhite = placeCornerTopUp(tableBW, rotateToFind)
	  if(cornerBackOrWhite === false)
		  {
		  if(generateFullInfo)				  
			  s += "<b style='color:red'>ERROR: no unique corner color found</b>"
		  }
	  else
		  {
		  tableBW = cornerBackOrWhite[1]
		  let topLeftCornerIsBlack = tableBW.charAt(0) == 'b'
		  s += "Corner = " + (topLeftCornerIsBlack ? "BLACK" : "WHITE")
		  let i = cornerBackOrWhite[0]
		  if (generateFullInfo && i > 0)
			  s += " (rotated right <b>" + (90 * i) + "deg</b>)"
		  
		  //no need to remove corners
			  
		  let bitsOrdered = ""
		  for(let i = 1; i <= 21; i++)	  
			if(bitToColRow[i] % 2 == 0) //
				  bitsOrdered = (tableBW.charAt(bitToColRow[i]-1) == 'b' ? 1 : 0) + bitsOrdered
			  else
				  bitsOrdered = (tableBW.charAt(bitToColRow[i]-1) == 'b' ? 0 : 1) + bitsOrdered
			  
		  decodedBits = decodeBitsOrdered(bitsOrdered, topLeftCornerIsBlack) 		  
			  
		  if(generateFullInfo)				  
		  {
		  s += "<br><br>Bits Ordered = " + bitsOrdered
		  s += "<br>Parity bits = " + decodedBits.parityBits[2] + decodedBits.parityBits[1] + decodedBits.parityBits[0]
		  s += "<br>Binary code = " + decodedBits.codeBinary
		  }
		  
		  let hadSuccess = decodedBits.posFailed[0] + decodedBits.posFailed[1] + decodedBits.posFailed[2]  == 0
		  if(generateFullInfo)				  
			  s += "<br><b style='color:"+(hadSuccess ? "green" : "red")+"'>Code = " + decodedBits.code + "</b><br>";
		  
		  if(hadSuccess)
			  {
			  if(generateFullInfo)				  
				  s += "<br><br><b style='color:green'>PARITY SUCCESS</b>"
			  }
		   else if(!tryToCorrect)
			   {
			   decodedBits.code = undefined;
			   if(generateFullInfo)				  
				  s += "<br><b style='color:red'>PARITY FAILED (did not try correction)"
			   }
		   else
		      {
			  let numberSuccess = 0
			  let noCorrectionPossible = 0
			  for(let letter = 0; letter < 3; letter++)	  
			  if(decodedBits.posFailed[letter] != 0)
			  {
			  if(generateFullInfo)				  
				  s += "<br><b style='color:red'>PARITY FAILED: position " + codeLetters.charAt(letter) + decodedBits.posFailed[letter] + "</b>"
			  if(decodedBits.posFailed[letter] > 7) 
				  noCorrectionPossible++
			  else 
				  {
				  if(decodedBits.failedPosition[letter].replace(/0/g, "").length == 1) 
					  numberSuccess++ //parity bit error
				  let posFailed = 21 - letter*7 - decodedBits.posFailed[letter]
				  let errorBit = bitsOrdered.charAt(posFailed)
				  bitsOrdered = bitsOrdered.slice(0, posFailed) 
				  				+ (errorBit == '1'? '0' : '1')
				  				+ bitsOrdered.slice(posFailed + 1)
				  }
			  }

			  if(numberSuccess > 0)
				  {
				  if(generateFullInfo)				  
					  s += "<br><br><b style='color:#440'>"+numberSuccess+" NUMBER SUCCESS(ES)</b> (parity bit corrupted - if one error)"
				  }
			  if(noCorrectionPossible > 0)
				  {
				  if(generateFullInfo)				  
					  s += "<br><b style='color:red'>"+noCorrectionPossible+" NO CORRECTION(S) POSSIBLE ("+decodedBits.posFailed+" > 7)</b>"
				  decodedBits.code = undefined
				  }

			  decodedBits = decodeBitsOrdered(bitsOrdered, topLeftCornerIsBlack) 		  
				
			  if(generateFullInfo)				  
			  {
			  s += "<br><br>Bits Corrected = " + bitsOrdered
			  s += "<br>Parity bits = " + decodedBits.parityBits
			  s += "<br>Binary code = " + decodedBits.codeBinary
			  s += "<br><b>Code = " + decodedBits.code + "</b>";
			  }
			  if(decodedBits.posFailed[0] + decodedBits.posFailed[1] + decodedBits.posFailed[2] == 0)
				  {
				  if(generateFullInfo)				  
					  s += "<br><br><b style='color:#440'>NUMBER SUCCESS (correct if max one error per ABC)"
				  }
			   else
				  {
				   if(generateFullInfo)				  
					  s += "<br><br><b style='color:red'>PARITY CORRECTION FAILED" 
				   decodedBits.code = undefined
				  }

			}
		  
		  }
	  
	  
	  if(generateFullInfo)				  
		  {
		  s += "<br>"
		  decodedBits.s = s
		  }
	  if(div)
		  $(div).html(s)
	  return decodedBits
},
//-------------------------------------------------
rotateLeft: function(table, div) {
	  
	  let s = "<br>";
	
	  let rotate = []
	  let insideHTML = []
	  
	  let tableBW = ""
	  let num = 0
	  for(let r = 0; r < table.rows.length; r++)
		  {
		  let row = table.rows[r];
		  for(let c = 0; c < row.cells.length; c++)
			  {
			  num++
			  rotate[rotateLeft[num]] = $(row.cells[c]).attr("bw")
			  insideHTML[rotateLeft[num]] = $(row.cells[c]).html()
			  }
		  }

	  num = 0
	  for(let r = 0; r < table.rows.length; r++)
	  {
	  let row = table.rows[r];
	  for(let c = 0; c < row.cells.length; c++)
		  {
		  num++
		  let bw = rotate[num]
		  $(row.cells[c]).attr("bw", bw).css("background-color", bw == "b" ? "#000" : "#fff")
		  $(row.cells[c]).attr("bw", bw).css("color", bw == "b" ? "#fff" : "#000")
		  $(row.cells[c]).html( insideHTML[num] )
		  }
	  }
	  
}
//-------------------------------------------------
  }
})();

