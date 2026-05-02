import React from 'react';
import { Invoice } from '@/src/types';
import { ShieldCheck } from 'lucide-react';

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice }) => {
  return (
    <div className="print-only" style={{ 
      backgroundColor: 'white', 
      color: 'black', 
      width: '100%', 
      padding: '40px',
      fontFamily: 'sans-serif',
      fontSize: '12px',
      lineHeight: '1.4'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white' }}>
            <ShieldCheck size={30} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>OrderShield</h1>
            <p style={{ margin: 0, fontSize: '10px', color: '#666', fontWeight: 'bold' }}>Operational Management System</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#ddd', fontWeight: '900' }}>INVOICE</h2>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>NO: {invoice.id || 'N/A'}</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>DATE: {invoice.issuedDate || 'N/A'}</p>
        </div>
      </div>

      {/* Info Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        <div>
          <h3 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', margin: '0 0 10px 0' }}>Billed To</h3>
          <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{invoice.customer || 'Customer'}</p>
          <p style={{ margin: 0 }}>{invoice.email || ''}</p>
          <p style={{ margin: 0 }}>{invoice.phone || ''}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h3 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', margin: '0 0 5px 0' }}>Order Info</h3>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Order ID: #{invoice.orderId || 'N/A'}</p>
          <p style={{ margin: 0 }}>Status: {invoice.status?.toUpperCase() || 'PENDING'}</p>
          <p style={{ margin: 0 }}>Due Date: {invoice.dueDate || 'N/A'}</p>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '40px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black', textAlign: 'left' }}>
            <th style={{ padding: '10px 0', fontSize: '10px', textTransform: 'uppercase' }}>Description</th>
            <th style={{ padding: '10px 0', fontSize: '10px', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
            <th style={{ padding: '10px 0', fontSize: '10px', textTransform: 'uppercase', textAlign: 'right' }}>Price</th>
            <th style={{ padding: '10px 0', fontSize: '10px', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items || []).map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '15px 0' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{item.description}</p>
              </td>
              <td style={{ padding: '15px 0', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '15px 0', textAlign: 'right' }}>৳ {item.unitPrice?.toLocaleString()}</td>
              <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 'bold' }}>৳ {item.total?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <div style={{ width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal:</span>
            <span>৳ {invoice.amount?.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Shipping:</span>
            <span>৳ {invoice.shippingCharge?.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid black', paddingTop: '10px', marginTop: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#2563eb' }}>TOTAL:</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>৳ {invoice.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#999', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold' }}>THANK YOU FOR YOUR BUSINESS</p>
        <div style={{ marginTop: '10px', fontSize: '8px', color: '#ccc', fontWeight: 'bold' }}>
          www.ordershield.com | support@ordershield.com | +880 1711-223344
        </div>
      </div>
    </div>
  );
};
