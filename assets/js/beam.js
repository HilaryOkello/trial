function toggleInputs() {
    const beamType = document.getElementById("beamType").value;
    const simpleBeamInputs = document.getElementById("simpleBeamInputs");
    const detailedBeamInputs = document.getElementById("detailedBeamInputs");
  
    if (beamType === "simple") {
      simpleBeamInputs.style.display = "block";
      detailedBeamInputs.style.display = "none";
    } else {
      simpleBeamInputs.style.display = "none";
      detailedBeamInputs.style.display = "block";
    }
  }

  toggleInputs();



function calculateBendingSchedule(clearSpan, devLength, cover, bottomDiameter, topDiameter, numBottomBars, numTopBars, stirrupDiameter, lengthZone1, spacingZone1, lengthZone2, spacingZone2, lengthZone3, spacingZone3, depthBeam, widthBeam, lengthHook, beamName, beamType, stirrupSpacing) {
    let numStirrupsCombined, cuttingLengthStirrup, totalStirrupsLength, weightOfStirrups;

    if (beamType === "simple") {
      const numStirrups = Math.floor(clearSpan / stirrupSpacing) + 1;
      cuttingLengthStirrup = 2 * (depthBeam + widthBeam) + (3 * 2 * stirrupDiameter) + (2 * lengthHook);
      totalStirrupsLength = numStirrups * cuttingLengthStirrup / 1000; // Convert mm to meters
      weightOfStirrups = (stirrupDiameter * stirrupDiameter * totalStirrupsLength) / 162;
      numStirrupsCombined = numStirrups;
    } else {
      const numStirrupsZone1 = Math.floor(lengthZone1 / spacingZone1) + 1;
      const numStirrupsZone2 = Math.ceil(lengthZone2 / spacingZone2) - 1;
      const numStirrupsZone3 = Math.floor(lengthZone3 / spacingZone3) + 1;
      numStirrupsCombined = `Zone 1: ${numStirrupsZone1}, Zone 2: ${numStirrupsZone2}, Zone 3: ${numStirrupsZone3}`;
      cuttingLengthStirrup = 2 * (depthBeam + widthBeam) + (3 * 2 * stirrupDiameter) + (2 * lengthHook);
      totalStirrupsLength = (numStirrupsZone1 + numStirrupsZone2 + numStirrupsZone3) * cuttingLengthStirrup / 1000; // Convert mm to meters
      weightOfStirrups = (stirrupDiameter * stirrupDiameter * totalStirrupsLength) / 162;
    }
  
  
    // Step 1: Calculate Cutting Length of the top bar
  const cuttingLengthTopBar = clearSpan + (2 * devLength * topDiameter) - (2 * cover);
  const topBarTotalLength = cuttingLengthTopBar * numTopBars / 1000;
  const weightOfTopBars = ( topDiameter * topDiameter * topBarTotalLength) / 162;

  // Step 2: Calculate Cutting Length of Bottom Bar
  const cuttingLengthBottomBar = clearSpan + (2 * devLength * bottomDiameter) - (2 * cover);
  const bottomBarTotalLength = cuttingLengthBottomBar * numBottomBars / 1000;
  const weightOfBottomBars = ( bottomDiameter * bottomDiameter * bottomBarTotalLength) / 162;

  // Format the output
  const output = `
  <h4>${beamName ? beamName : ''} Bar Bending Schedule</h4>
<div class="table-responsive beam-schedule">
    <table class="table table-bordered table-striped">
        <thead class="thead-dark">
            <tr>
                <th scope="col">Shape</th>
                <th scope="col">Bar Type</th>
                <th scope="col">Diameter (mm)</th>
                <th scope="col">Numbers</th>
                <th scope="col">Cutting Length (mm)</th>
                <th scope="col">Total Length (mm)</th>
                <th scope="col">Total Weight (kg)</th> <!-- Added column -->
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><img src="assets/images/beam/top_bar_shape.jpg" style="max-width: 100px; max-height: 100px;"></td>
                <td>Top bars</td>
                <td>${topDiameter}</td>
                <td>${numTopBars}</td>
                <td>${cuttingLengthTopBar}</td>
                <td>${topBarTotalLength}</td>
                <td>${weightOfTopBars.toFixed(2)}</td> <!-- Total weight calculation -->
            </tr>
            <tr>
                <td><img src="assets/images/beam/bottom_bar_shape.jpg" style="max-width: 100px; max-height: 100px;"></td>
                <td>Bottom bars</td>
                <td>${bottomDiameter}</td>
                <td>${numBottomBars}</td>
                <td>${cuttingLengthBottomBar}</td>
                <td>${bottomBarTotalLength}</td>
                <td>${weightOfBottomBars.toFixed(2)}</td> <!-- Total weight calculation -->
            </tr>
            <tr>
                <td><img src="assets/images/beam/stirrup_shape.jpg" style="max-width: 100px; max-height: 100px;"></td>
                <td>Stirrups</td>
                <td>${stirrupDiameter}</td>
                <td>${numStirrupsCombined}</td>
                <td>${cuttingLengthStirrup}</td>
                <td>${totalStirrupsLength}</td>
                <td>${weightOfStirrups.toFixed(2)}</td> <!-- Total weight calculation -->
            </tr>
        </tbody>
    </table>
</div>
<div class="col-md-12 text-center">
<a href="#" id="generatePDFButton" class="outline-button my-2">Download PDF</a>
</div>
`;
  return output;
}

function generatePDF(tableContent) {
    // Create an image element to load the image
    const imgElement = new Image();

    // Set up event listener for when the image is loaded
    imgElement.onload = function() {
        // Create a canvas element to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;

        // Draw the image onto the canvas
        ctx.drawImage(imgElement, 0, 0);

        // Convert the canvas content to a data URL
        const imageDataUrl = canvas.toDataURL('image/png'); // Adjust the format as needed

        // Parse tableContent to get the beamName
        const tempDivElement = document.createElement('div');
        tempDivElement.innerHTML = tableContent;
        const beamName = tempDivElement.querySelector('h4').innerText;

        // Define the PDF document definition with the image data URL
        const docDefinition = {
            header: function(currentPage, pageCount) {
                return { text: `${beamName}`, alignment: 'center', margin: [0, 20, 0, 0] }; // Title of the table as the header
            },
            footer: function(currentPage, pageCount) {
                return {
                    columns: [
                        {
                            image: imageDataUrl,
                            width: 30,
                            alignment: 'left'
                        },
                        {
                            text: 'Generated By Onyango Okello IT Consultancy\n',
                            alignment: 'center',
                            fontSize: 10
                        },
                        {
                            text: 'onyangookello.com/tools.html',
                            alignment: 'right',
                            fontSize: 10,
                            link: 'http://onyangookello.com/tools'
                        }
                    ],
                    margin: [40, 0, 40, 0]
                };
            },
            content: [
                {
                    layout: 'lightHorizontalLines',
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        body: parseHTMLTableContent(tableContent)
                    }
                }
            ]
        };

        // Create PDF using pdfMake
        pdfMake.createPdf(docDefinition).download();
    };

    // Set the src attribute of the image element to start loading the image
    imgElement.src = 'assets/images/logo.png'; // Replace 'path/to/your/image.png' with the actual URL of your PNG image
}
  
  // Helper function to parse HTML table content into an array of arrays representing rows and cells
  function parseHTMLTableContent(tableContent) {
    // Create a temporary div element to hold the HTML content
    const tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = tableContent;
  
    // Extract table rows from the temporary div element
    const tableRows = tempDivElement.querySelectorAll('tr');
  
    // Initialize an array to hold the body of the PDF table
    const pdfTableBody = [];
  
    // Iterate over each table row
    tableRows.forEach(row => {
      const pdfRow = [];
  
      // Extract table cells from the row
      const cells = row.querySelectorAll('td, th'); // Include table headers as well
  
      // Iterate over each cell in the row
      cells.forEach(cell => {
        const imgElement = cell.querySelector('img');
            if (imgElement) {
                // If an image is found, convert it to a data URL
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                ctx.drawImage(imgElement, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                const imageData = {
                    image: dataUrl,
                    auto: true // Adjust the height of the image as needed
                };
                pdfRow.push(imageData);
        } else {
          // Get the cell content (text)
          const cellContent = cell.innerText.trim();
          pdfRow.push(cellContent);
        }
      });
  
      // Push the PDF row to the PDF table body
      pdfTableBody.push(pdfRow);
    });
    // Return the parsed table body
    return pdfTableBody;
  }

// Function to handle button click for calculation
document.getElementById("calculateButton").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Get values from form inputs
  const beamType = document.getElementById("beamType").value;
  const beamName = document.getElementById("beamName").value;
  const clearSpan = parseFloat(document.getElementById("clearSpan").value);
  const widthBeam = parseFloat(document.getElementById("widthBeam").value);
  const depthBeam = parseFloat(document.getElementById("depthBeam").value);
  const devLength = parseFloat(document.getElementById("devLength").value);
  const cover = parseFloat(document.getElementById("cover").value);
  const bottomDiameter = parseFloat(document.getElementById("bottomDiameter").value);
  const topDiameter = parseFloat(document.getElementById("topDiameter").value);
  const numBottomBars = parseFloat(document.getElementById("numBottomBars").value);
  const numTopBars = parseFloat(document.getElementById("numTopBars").value);
  const stirrupDiameter = parseFloat(document.getElementById("stirrupDiameter").value);
  const lengthHook = parseFloat(document.getElementById("lengthHook").value);
  let stirrupSpacing = null; // Default value for simple beams
  let lengthZone1 = null, spacingZone1 = null, lengthZone2 = null, spacingZone2 = null, lengthZone3 = null, spacingZone3 = null; // Default values for detailed beams

  if (beamType === "simple") {
    stirrupSpacing = parseFloat(document.getElementById("stirrupSpacing").value);
  } else {
    spacingZone1 = parseFloat(document.getElementById("spacingZone1").value);
    lengthZone1 = parseFloat(document.getElementById("lengthZone1").value);
    spacingZone2 = parseFloat(document.getElementById("spacingZone2").value);
    lengthZone2 = parseFloat(document.getElementById("lengthZone2").value);
    spacingZone3 = parseFloat(document.getElementById("spacingZone3").value);
    lengthZone3 = parseFloat(document.getElementById("lengthZone3").value);
  }


  // Calculate bar bending schedule
  const bendingSchedule = calculateBendingSchedule(clearSpan, devLength, cover, bottomDiameter, topDiameter, numBottomBars, numTopBars, stirrupDiameter, lengthZone1, spacingZone1, lengthZone2, spacingZone2, lengthZone3, spacingZone3, depthBeam, widthBeam, lengthHook, beamName, beamType, stirrupSpacing);

  // Display the bending schedule
  document.getElementById("output").innerHTML = bendingSchedule;

  const tableContent = document.getElementById("output").innerHTML;

    // Add event listener to generate PDF button
    document.getElementById("generatePDFButton").addEventListener("click", function() {
        generatePDF(tableContent);
    });
});



