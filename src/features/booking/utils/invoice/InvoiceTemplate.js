

export const generateInvoiceHtml = (data) => {
    // Basic data extraction
    const {
        appointmentId,
        invoiceNumber,
        invoiceDate,
        customerName,
        customerAddress: _customerAddress, // Assuming this might contain city/state if generic
        customerCity,
        customerState, // e.g., "27-Maharashtra" or "Karnataka"
        customerCountry, // e.g., "India" or "United States"
        customerPincode: _customerPincode,
        customerGst,
        customerPhone, // Need to ensure this is passed or handled
        items, // Array of { description, hsn, quantity, rate, amount, duration }
        subTotal,
        discount: _discount, // Not shown in image but good to keep
        taxableAmount: _taxableAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
        totalAmountWords,
        isInternational,
        placeOfSupply, // e.g., "27-Maharashtra"
        status // PAID, CANCELLED, REFUNDED
    } = data;

    // Company Data (From Image)
    const company = {
        name: "Vishvara Tech India Pvt.Ltd",
        lines: [
            "GROUND FLOOR H. NO. 1286 MODAK HOUSE",
            "SASWAD",
            "ROAD Pune"
        ],
        phone: "9689873927",
        email: "bconsolto@gmail.com",
        gstin: "27AAJCV7498P1Z1",
        state: "27-Maharashtra"
    };

    // Helper for formatting currency
    // Helper for formatting currency
    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);

    // Helper for formatting date
    const formatDate = (dateString) => {
        if (!dateString) {
return '';
}
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-'); // DD-MM-YYYY
    };

    // Determine GST Label for Table Row
    // Image 2 shows "₹ 152.54 (18%)" for IGST case
    const getGstContent = () => {
        if (isInternational) {
return '₹0.00';
}

        const totalTax = (igst || 0) + (cgst || 0) + (sgst || 0);
        let rate = '0%';
        if (totalTax > 0) {
            // Approximate rate calculation or hardcode 18% if standard
            // If igst > 0, likely 18%. If cgst, 9+9=18%
            rate = '18%';
            // In image 3 (intra), it might show sum? Image 3 Table shows "₹ 152.54 (18%)" in the generic 'GST' column?
            // Yes, standard practice is to show total GST tax amount and rate in the line item.
        }
        return `${formatCurrency(totalTax)} <br><span style="font-size: 10px">(${rate})</span>`;
    };

    // Build Items Rows
    const itemsRows = items.map((item, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="font-weight: bold;">${item.description}</td>
            <td style="text-align: center;">${item.hsn || '9983'}</td>
            <td style="text-align: center;">${item.duration || '30 Minutes'}</td> 
            <td style="text-align: center;">${item.quantity || 1}</td>
            <td style="text-align: right;">${formatCurrency(item.rate)}</td>
            <td style="text-align: center;">${getGstContent()}</td>
            <td style="text-align: right; font-weight: bold;">${formatCurrency(item.amount)}</td>
        </tr>
    `).join('');

    // Totals Section Logic
    let taxRows = '';

    // Always show Sub Total
    taxRows += `
        <tr>
            <td style="text-align: left;">Sub Total</td>
            <td style="text-align: right;">${formatCurrency(subTotal)}</td>
        </tr>
    `;

    if (isInternational) {
        // International / Export
        taxRows += `
            <tr>
                <td style="text-align: left;">IGST (0%)</td>
                <td style="text-align: right;">${formatCurrency(0)}</td>
            </tr>
        `;
    } else if (igst > 0) {
        // Inter-state
        taxRows += `
            <tr>
                <td style="text-align: left;">IGST@18%</td>
                <td style="text-align: right;">${formatCurrency(igst)}</td>
            </tr>
        `;
    } else {
        // Intra-state
        taxRows += `
            <tr>
                <td style="text-align: left;">SGST@9%</td>
                <td style="text-align: right;">${formatCurrency(sgst)}</td>
            </tr>
            <tr>
                <td style="text-align: left;">CGST@9%</td>
                <td style="text-align: right;">${formatCurrency(cgst)}</td>
            </tr>
        `;
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Tax Invoice</title>
        <style>
            body { 
                font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; 
                font-size: 12px; 
                color: #000; 
                line-height: 1.4; 
                padding: 30px; 
                max-width: 800px;
                margin: 0 auto;
                background: #fff;
            }
            
            /* Header */
            .header-container {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .company-details h1 {
                font-size: 20px;
                font-weight: bold;
                margin: 0 0 5px 0;
                color: #000;
            }
            .company-details p {
                margin: 2px 0;
                font-size: 11px;
                color: #333;
            }
            .logo-container {
                text-align: right;
            }
            /* Placeholder for logo if image not available, user can replace src */
            .logo-img {
                width: 80px;
                height: auto;
                border-radius: 12px;
            }
            
            /* Title */
            .invoice-title {
                text-align: center;
                color: #8B5CF6; /* Light Purple */
                font-size: 22px;
                font-weight: bold;
                margin: 20px 0 10px 0;
                text-transform: capitalize;
            }
            
            .status-paid { color: #22c55e; font-weight: bold; }
            .status-cancelled { color: #ef4444; font-weight: bold; }
            
            /* Info Columns */
            .info-columns {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .left-col {
                flex: 1;
            }
            .right-col {
                flex: 1;
                text-align: right;
            }
            
            .info-label {
                font-weight: bold;
                font-size: 12px;
                margin-bottom: 5px;
            }
            .info-value {
                font-size: 11px;
                margin-bottom: 8px;
            }
            .info-group {
                margin-bottom: 10px;
            }
            
            /* Table */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            
            th {
                background-color: #908ce4; /* Periwinkle/Purple from image */
                color: white;
                padding: 10px 5px;
                text-align: left;
                font-weight: bold;
                font-size: 11px;
                border: none;
            }
            th:first-child { border-top-left-radius: 4px; border-bottom-left-radius: 4px; }
            th:last-child { border-top-right-radius: 4px; border-bottom-right-radius: 4px; }
            
            td {
                padding: 10px 5px;
                border-bottom: 1px solid #ddd;
                font-size: 11px;
                vertical-align: middle;
            }
            
            /* Footer Section */
            .footer-container {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            
            .left-footer {
                flex: 6; /* 60% */
                padding-right: 20px;
            }
            
            .right-footer {
                flex: 4; /* 40% */
            }
            
            .amount-words-group {
                margin-bottom: 20px;
            }
            .amount-words-label {
                font-weight: bold;
                font-size: 11px;
                margin-bottom: 4px;
            }
            .amount-words-value {
                font-size: 12px;
            }
            
            .terms-group h4 {
                margin: 0 0 8px 0;
                font-size: 11px;
            }
            .terms-text {
                font-size: 10px;
                color: #444;
                text-align: justify;
                line-height: 1.5;
            }
            
            /* Totals Table */
            .totals-table {
                width: 100%;
                margin-bottom: 10px;
            }
            .totals-table td {
                border-bottom: none;
                padding: 5px 0;
            }
            
            .total-row {
                background-color: #908ce4;
                color: white;
                font-weight: bold;
                padding: 8px 10px;
            }
            .total-row td {
                padding: 8px 5px;
            }
            
            .received-row {
                border-bottom: 1px solid #000;
                font-weight: normal;
                padding-bottom: 5px;
                margin-bottom: 20px;
            }
            
            .signature-block {
                margin-top: 40px;
                text-align: right;
            }
            .signature-text {
                font-size: 11px;
                font-weight: bold;
            }
            
            /* Borders */
            .top-border {
                border-top: 1px solid #908ce4;
                margin-top: 10px;
                padding-top: 10px;
            }
        </style>
    </head>
    <body>
    
        <!-- Header -->
        <div class="header-container">
            <div class="company-details">
                <h1>${company.name}</h1>
                ${company.lines.map(line => `<p>${line}</p>`).join('')}
                <p>Phone no. : ${company.phone}</p>
                <p>Email : ${company.email}</p>
                <p>GSTIN : ${company.gstin}</p>
                <p>State: ${company.state}</p>
            </div>
            <div class="logo-container">
                ${data.logoBase64 ?
            `<img src="data:image/png;base64,${data.logoBase64}" class="logo-img" alt="Consolto Logo" />` :
            `<div style="color: #0088cc; font-weight: bold; font-size: 24px; border: 2px solid #0088cc; border-radius: 8px; padding: 5px 10px; display: inline-block;">
                        <span style="font-size: 20px;">💬</span> consolto
                    </div>`
        }
            </div>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #908ce4; margin-bottom: 0;">
        
        <!-- Title -->
        <div class="invoice-title">Tax Invoice</div>
        
        <!-- Bill To / Details -->
        <div class="info-columns">
            <div class="left-col">
                <div class="info-group">
                    <div class="info-label">Bill To</div>
                    <div class="info-value"><strong>${customerName}</strong></div>
                    <div class="info-value">${customerCity || ''}</div>
                    <div class="info-value">Contact No. : ${customerPhone || data.customerPhone || ''}</div>
                    ${customerGst ? `<div class="info-value">GSTIN: ${customerGst}</div>` : ''} 
                    <div class="info-value">State: ${customerState || '-'}</div>
                    ${customerCountry ? `<div class="info-value">Country: ${customerCountry}</div>` : ''}
                </div>
            </div>
            
            <div class="right-col">
                <div class="info-group">
                    <div class="info-label">Invoice Details</div>
                    <div class="info-value">Invoice No. : ${invoiceNumber}</div>
                    ${status ? `<div class="info-value">Status: <span class="${status === 'PAID' ? 'status-paid' : 'status-cancelled'}">${status === 'PAID' ? 'Completed' : 'Cancelled'}</span></div>` : ''}
                    <div class="info-value">Date : ${formatDate(invoiceDate)}</div>
                    <div class="info-value">Booking ID: ${appointmentId}</div>
                    <div class="info-value">Place of supply: ${placeOfSupply || '-'}</div>
                </div>
            </div>
        </div>
        
        <!-- Items Table -->
        <table>
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">#</th>
                    <th style="width: 25%;">Item name</th>
                    <th style="width: 10%; text-align: center;">HSN/SAC</th>
                    <th style="width: 15%; text-align: center;">Time Slot</th>
                    <th style="width: 10%; text-align: center;">Quantity</th>
                    <th style="width: 15%; text-align: right;">Price/ Unit</th>
                    <th style="width: 10%; text-align: center;">GST</th>
                    <th style="width: 10%; text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
        </table>
        
        <hr style="border: 0; border-top: 1px solid #000; margin-bottom: 20px;">
        
        <!-- Footer Layout -->
        <div class="footer-container">
            <div class="left-footer">
                <div class="amount-words-group">
                    <div class="amount-words-label">Invoice Amount In Words</div>
                    <div class="amount-words-value">${totalAmountWords || `INR ${ totalAmount } Only`}</div>
                </div>
                
                <div class="terms-group">
                    <h4>Terms and Conditions</h4>
                    <div class="terms-text">
                        "Consolto is a technology aggregator platform facilitating consultations between Clients and independent Experts. Services are provided solely by the Expert. GST is charged on the total booking amount as applicable. Consolto does not provide professional advice or guarantee outcomes."
                    </div>
                </div>
            </div>
            
            <div class="right-footer">
                <table class="totals-table">
                    ${taxRows}
                </table>
                
                <table class="totals-table" style="margin-top: 0;">
                     <tr class="total-row">
                        <td style="text-align: left;">Total</td>
                        <td style="text-align: right;">${formatCurrency(totalAmount)}</td>
                    </tr>
                </table>
                
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 2px solid #ccc; margin-bottom: 10px;">
                    <span>Received</span>
                    <span style="font-weight: bold;">${formatCurrency(totalAmount)}</span>
                </div>
                
                <div class="signature-block">
                    <div style="margin-bottom: 40px;">For :Vishvara Tech India Pvt.Ltd</div>
                    <div class="signature-text">Authorized Signatory</div>
                </div>
            </div>
        </div>

    </body>
    </html>
    `;
};

