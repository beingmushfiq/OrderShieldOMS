import React from 'react';
import { ShieldCheck, MapPin, Mail, Smartphone, Fingerprint, CreditCard, ShoppingBag, Check, Truck } from 'lucide-react';

interface PrintableCustomerReportProps {
  customer: any;
}

export const PrintableCustomerReport: React.FC<PrintableCustomerReportProps> = ({ customer }) => {
  if (!customer) return null;

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
          <div style={{ width: '50px', height: '50px', backgroundColor: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <ShieldCheck size={30} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>OrderShield</h1>
            <p style={{ margin: 0, fontSize: '10px', color: '#666', fontWeight: 'bold' }}>Customer Intelligence Report</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#4f46e5', fontWeight: '900' }}>CUSTOMER PROFILE</h2>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>ID: {customer.id}</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>REPORT DATE: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '30px' }}>
        <div>
          <h3 style={{ fontSize: '10px', textTransform: 'uppercase', color: '#999', margin: '0 0 5px 0' }}>Basic Information</h3>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>{customer.name}</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Email Address</p>
              <p style={{ margin: '2px 0 0 0', fontWeight: 'bold' }}>{customer.email}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Location</p>
              <p style={{ margin: '2px 0 0 0', fontWeight: 'bold' }}>{customer.location}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Fraud Risk Score</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <h2 style={{ margin: 0, fontSize: '36px', fontWeight: '900', color: customer.fraudRiskScore >= 90 ? '#ef4444' : '#4f46e5' }}>{customer.fraudRiskScore}</h2>
            <span style={{ 
              backgroundColor: customer.fraudRiskScore >= 90 ? '#fee2e2' : '#e0e7ff', 
              color: customer.fraudRiskScore >= 90 ? '#ef4444' : '#4f46e5',
              padding: '2px 8px',
              borderRadius: '5px',
              fontSize: '10px',
              fontWeight: '900'
            }}>
              {customer.fraudRiskScore >= 90 ? 'HIGH RISK' : customer.fraudRiskScore >= 40 ? 'MEDIUM' : 'LOW RISK'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#999', textTransform: 'uppercase' }}>Lifetime Value</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '900' }}>৳ {(customer.lifetimeValue || 0).toLocaleString()}</p>
        </div>
        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#999', textTransform: 'uppercase' }}>Customer Tier</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#10b981' }}>{customer.tier}</p>
        </div>
        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#999', textTransform: 'uppercase' }}>Member Since</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '900' }}>{customer.memberSince}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#000', fontWeight: '900', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>Recent Order History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', fontSize: '10px', color: '#999', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '10px 0' }}>ORDER ID</th>
              <th style={{ padding: '10px 0' }}>DATE</th>
              <th style={{ padding: '10px 0' }}>STATUS</th>
              <th style={{ padding: '10px 0', textAlign: 'right' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {(customer.orders || []).slice(0, 10).map((order: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px 0', fontWeight: 'bold' }}>#{order.order_id}</td>
                <td style={{ padding: '12px 0' }}>{new Date(order.order_date).toLocaleDateString()}</td>
                <td style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>{order.status}</span>
                </td>
                <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold' }}>৳ {order.total_amount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center' }}>
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ margin: 0, color: '#999', fontSize: '9px', letterSpacing: '1px' }}>CONFIDENTIAL • ORDERSHIELD INTERNAL USE ONLY</p>
          <p style={{ margin: '5px 0 0 0', color: '#ccc', fontSize: '8px' }}>Generated by OrderShield OMS Intelligence Engine</p>
        </div>
      </div>
    </div>
  );
};
