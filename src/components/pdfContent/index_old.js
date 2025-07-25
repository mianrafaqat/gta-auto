'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

import { Button, Grid } from '@mui/material';

import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';
import { PdfDownloadService } from 'src/services';

const DownloadPdfFile = ({ orderId, row, leiferschein }) => {
  console.log('🚀 ~ DownloadPdfFile ~ row:', row);
  // const [leiferschein, setLeiferschein] = useState(null);
  // console.log('🚀 ~ DownloadPdfFile ~ leiferschein:', leiferschein);
  const pdfGeneratorRef = useRef(null);

  const handleDownload = async () => {
    const ref = pdfGeneratorRef.current;
    const response = await PdfDownloadService.getLieferschein(row?.orderDetail?.orderID);
    console.log('🚀 ~ handleDownload ~ response:', response);

    console.log('pdfGeneratorRef.current', ref);
    if (ref) {
      ref.handleDownload();
    }
  };
  // const handleGetLieferschein = async () => {
  //   const response = await PdfDownloadService.getLieferschein(row?.orderDetail?.orderID);
  //   console.log('🚀 ~ handleDownload ~ response:', response);
  //   if (response?.data?.status === '200') {
  //     setLeiferschein(response?.data?.data?.leiferscheinId);
  //   }
  // };

  // useEffect(() => {
  //   handleGetLieferschein();
  // }, [row?.orderDetail?.orderID]);
  const currentDate = new Date();

  return (
    <>
      <Grid sx={{ display: 'none' }}>
        <PdfGenerator
          ref={pdfGeneratorRef}
          data={
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <small>S-Trade GmbH| Großenhainer Str. 98 | 01127 Dresden</small>
                <h3>{row?.internalOrderStatus}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '325px 1fr', gap: '30px' }}>
                <p>{row?.orderDetail?.shippingAddress?.name}</p>
                <p>
                  Customer Address:
                  {row?.orderDetail?.shippingAddress?.street1 &&
                    ` ${row?.orderDetail?.shippingAddress?.street1},`}
                  {row?.orderDetail?.shippingAddress?.street2 &&
                    ` ${row?.orderDetail?.shippingAddress?.street2},`}
                  {row?.orderDetail?.shippingAddress?.cityName &&
                    ` ${row?.orderDetail?.shippingAddress?.cityName},`}
                  {row?.orderDetail?.shippingAddress?.countryName &&
                    ` ${row?.orderDetail?.shippingAddress?.countryName}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '17px' }}>Customer Number</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Kundennumber</span>
                  <span style={{ fontSize: '12px' }}>
                    {row?.orderDetail?.shippingAddress?.phone}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '17px' }}>Order Date</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Auftragsdatum</span>
                  <span style={{ fontSize: '12px' }}>
                    {' '}
                    {row?.orderDetail?.createdTime
                      ? format(new Date(row?.orderDetail?.createdTime), 'dd MMM yyyy HH:mm')
                      : ''}
                  </span>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '17px' }}>Current Date</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Datum</span>
                  <span style={{ fontSize: '12px' }}>
                    {' '}
                    {currentDate ? format(currentDate, 'dd MMM yyyy HH:mm') : ''}
                  </span>
                </div>
              </div>
              <div>
                <h4>Lieferschein Nr. {leiferschein}</h4>
                <span>
                  Wir bedanken uns für die Bestellung und liefern Ihnen vereinbarungsgemäß folgende
                  Waren:
                </span>
              </div>
              <div>
                <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderTop: '2px solid black',
                          borderBottom: '2px solid black',
                          padding: '8px',
                          textAlign: 'left',
                        }}
                      >
                        POS.
                      </th>
                      <th
                        style={{
                          borderTop: '2px solid black',
                          borderBottom: '2px solid black',
                          padding: '8px',
                          textAlign: 'left',
                        }}
                      >
                        Beizevhnung
                      </th>
                      <th
                        style={{
                          borderTop: '2px solid black',
                          borderBottom: '2px solid black',
                          padding: '8px',
                          textAlign: 'left',
                        }}
                      >
                        Menge
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {row?.orderDetail?.transactionArray?.transaction?.map((transaction, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px', textAlign: 'left', verticalAlign: 'top' }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '8px' }}>
                          {row?.orderDetail?.buyerUserID} <br /> <b>{transaction?.item?.title}</b>
                        </td>
                        <td style={{ padding: '8px' }}>{transaction?.quantityPurchased}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <footer style={{ width: '100%', fontSize: '13px', marginTop: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* Column 1 */}
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      <li>S-Trade GmbH GmbH</li>
                      <li>Suite 14500 </li>
                      <li>Großenhainer Str. 98</li>
                      <li>01127 Dresden</li>
                    </ul>
                  </div>

                  {/* Column 2 */}
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      <li>Tel.: (+49) 351 89 664 772</li>
                      <li>E-Mail: mail@s.trade.com</li>
                      <li>Web: www.s.trade.com</li>
                    </ul>
                  </div>

                  {/* Column 3 */}
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      <li>Volksbank XXXXXXX</li>
                      <li>IBAN: DE34233004333401</li>
                      <li>BIC: GENODE61FR1 Kto.</li>
                      <li>Inh.: XXXXXXXXX</li>
                    </ul>
                  </div>

                  {/* Column 4 */}
                  <div style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      <li>Ust-IdNr.: XXXXXXXX</li>
                    </ul>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
      </Grid>
      <span onClick={handleDownload}>Download leiferschine</span>
    </>
  );
};

export default DownloadPdfFile;
const PdfGenerator = React.forwardRef(({ data }, ref) => {
  const pdfContentRef = useRef(null);

  const handleDownload = async () => {
    try {
      const pdfContent = pdfContentRef.current;
      console.log('pdfContent: ', pdfContent);

      if (pdfContent) {
        const timestamp = new Date().valueOf();
        const filename = `Custom_PDF_${timestamp}.pdf`;

        html2pdf(pdfContent, {
          margin: 10,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
        });
      }
    } catch (error) {
      console.error('Error in handleDownload:', error);
      // Handle the error, notify the user, or log it as needed
    }
  };

  // Assign the ref to the internal ref
  React.useImperativeHandle(ref, () => ({
    handleDownload,
  }));

  return (
    <div ref={pdfContentRef}>
      {/* Dynamic content goes here */}
      {data}
    </div>
  );
});
