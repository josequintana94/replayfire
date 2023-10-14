function generateQRCode() {
    const name = document.getElementById("nameInput").value;
    const uniqueId = generateUniqueId(); // You need to implement this function
    const url = `https://myurl.com/store${uniqueId}`;
    const qrCodeData = `${uniqueId} - ${name}`;

    // Generate QR Code
    const qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = ""; // Clear previous QR code
    const qrCode = new QRCode(qrcodeDiv, {
        text: qrCodeData,
        width: 200,
        height: 200
    });

    //show qr code
    qrcodeDiv.style.display = "block";
    
    // Save QR Code
    const qrCodeImage = document.getElementById("qrImg");
    qrCodeImage.src = qrCode._el.firstChild.toDataURL("image/png");
    qrCodeImage.style.display = "block";
}