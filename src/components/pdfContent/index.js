import React from 'react';
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { PdfDownloadService } from 'src/services';

const TableRowWithDownload = ({ orderId, row, email = '' }) => {
  const handleDownload = async () => {
    const currentDate = new Date();

    const { data: res } = await PdfDownloadService.getLieferschein(row?.orderDetail?.orderID);
    const leiferschein = res?.data?.leiferscheinId;
    const {
      sellerAddress = '',
      sellerEmail = '',
      sellerPhone = '',
      sellerWeb = '',
      ustIdNr = '',
      bankName = '',
      bic = '',
      iban = '',
      kto = '',
    } = res?.data || {};

    const data = `
  <div style="display: grid; grid-template-rows: repeat(2, auto); width: 794px; height: 1122px; position: relative; margin: auto; padding: 10mm; box-sizing: border-box;">
    <div>
      <div style="display: flex; align-items: center; gap: 30px;">
        <small>S-Trade GmbH| Großenhainer Str. 98 | 01127 Dresden</small>
      </div>
      <div style="margin-top: 5px; display: flex; flex-direction: column; gap: 3px;">
        <p style="margin: 0;">${row?.orderDetail?.shippingAddress?.name}</p>
        <p style="margin: 0;">
          ${
            row?.orderDetail?.shippingAddress?.street1
              ? row?.orderDetail?.shippingAddress?.street1 + ','
              : ''
          }
          ${
            row?.orderDetail?.shippingAddress?.street2
              ? row?.orderDetail?.shippingAddress?.street2 + ','
              : ''
          }
          ${
            row?.orderDetail?.shippingAddress?.cityName
              ? row?.orderDetail?.shippingAddress?.cityName + ','
              : ''
          }
          ${
            row?.orderDetail?.shippingAddress?.countryName
              ? row?.orderDetail?.shippingAddress?.countryName
              : ''
          }
        </p>
      </div>
      <div style="display: flex; gap: 20px; justify-content: end;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <span style="font-weight: bold; font-size: 13px;">Kundennumber</span>
          <span style="font-size: 12px;">${row?.orderDetail?.shippingAddress?.phone}</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <span style="font-weight: bold; font-size: 13px;">Auftragsdatum</span>
          <span style="font-size: 12px;">
            ${
              row?.orderDetail?.createdTime
                ? format(new Date(row?.orderDetail?.createdTime), 'dd.MM.yyyy HH:mm')
                : ''
            }
          </span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
          <span style="font-weight: bold; font-size: 13px;">Datum</span>
          <span style="font-size: 12px;">
            ${currentDate ? format(currentDate, 'dd.MM.yyyy HH:mm') : ''}
          </span>
        </div>
      </div>
      <div>
        <h4>Lieferschein Nr. ${leiferschein}</h4>
        <span>Wir bedanken uns für die Bestellung und liefern Ihnen vereinbarungsgemäß folgende Waren:</span>
      </div>
      <div>
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border-top: 2px solid black; border-bottom: 2px solid black; padding: 8px; text-align: left;">POS.</th>
              <th style="border-top: 2px solid black; border-bottom: 2px solid black; padding: 8px; text-align: left;">Bezeichnung</th>
              <th style="border-top: 2px solid black; border-bottom: 2px solid black; padding: 8px; text-align: left;">Menge</th>
            </tr>
          </thead>
          <tbody>
            ${row?.orderDetail?.transactionArray?.transaction
              ?.map(
                (transaction, index) => `
                  <tr key="${index}">
                    <td style="padding: 8px; text-align: left; vertical-align: top;">${
                      index + 1
                    }</td>
                    <td style="padding: 8px;">${row?.orderDetail?.buyerUserID} <br> <b>${
                      transaction?.item?.title
                    }</b></td>
                    <td style="padding: 8px;">${transaction?.quantityPurchased}</td>
                  </tr>
                `
              )
              .join('')}
              
          </tbody>
        </table>
      </div>
    </div>
    <div style="margin-top: auto;">
      <footer style="font-size: 13px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="flex: 1; margin-right: 20px;">
            <ul style="list-style: none; margin: 0; padding: 0;">
              <li>${sellerAddress}</li>
            </ul>
          </div>
          <div style="flex: 1; margin-right: 20px;">
            <ul style="list-style: none; margin: 0; padding: 0;">
              <li>Tel.: ${sellerPhone}</li>
              <li>E-Mail: ${sellerEmail}</li>
              <li>Web: ${sellerWeb}</li>
            </ul>
          </div>
          <div style="flex: 1; margin-right: 20px;">
            <ul style="list-style: none; margin: 0; padding: 0;">
              <li>Bank: ${bankName}</li>
              <li>IBAN: ${iban}</li>
              <li>BIC: ${bic} ${kto}</li>
            </ul>
          </div>
          <div style="flex: 1;">
            <ul style="list-style: none; margin: 0; padding: 0;">
              <li>Ust-IdNr.: ${ustIdNr}</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  </div>
`;

    try {
      const el = document.createElement('div');
      el.innerHTML = data;
      el.style.position = 'absolute'; // Position element out of the visible area
      el.style.left = '-9999px';
      el.style.top = '-9999px';

      document.body.appendChild(el); // Add to document to render

      const contentHeight = el.offsetHeight;

      const pageHeight = 1122; // A4 page height in pixels minus margins
      const footerHeight = 150; // Adjust based on your footer's actual height
      const usableHeight = pageHeight - footerHeight;
      let numberOfPages = Math.ceil(contentHeight / usableHeight);

      document.body.removeChild(el);

      await html2pdf(data, {
        numberOfPages,
        margin: 0,
        filename: `Order_${orderId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          numberOfPages,
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      });
    } catch (error) {
      console.error('Error in handleDownload:', error);
    }
  };

  return <span onClick={handleDownload}>Download Leiferschein</span>;
};

export default TableRowWithDownload;
