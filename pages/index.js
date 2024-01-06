import { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [amount, setAmount] = useState(2000000);
  const [voucher, setVoucher] = useState(null);
  const [voucherStatus, setVoucherStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateVoucher = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/generate-voucher', { amount });
      setVoucher(response.data);
      setVoucherStatus(null);
      setError(null);
    } catch (error) {
      console.error('Error generating voucher:', error);
      setError('Error generating voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const useVoucher = () => {
    if (voucher) {
      setVoucherStatus('Voucher telah digunakan');
  
      setVoucher((prevVoucher) => ({
        ...prevVoucher,
        expirationDate: new Date().toISOString(),
      }));
      setError(null);
    }
  };
  
  const checkVoucherStatus = () => {
    if (voucher && voucher.expirationDate) {
      const currentDate = new Date();
      const expirationDate = new Date(voucher.expirationDate);
  
      if (currentDate <= expirationDate) {
        setVoucherStatus('Voucher masih aktif');
      } else {
        setVoucherStatus('Voucher sudah tidak aktif');
      }
    }
    setError(null);
  };

  const handleAmountChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setAmount(parseInt(inputValue, 10) || 0);
  };

  const handleVoucherGeneration = () => {
    if (amount > 1999999) {
      generateVoucher();
    } else {
      setError('Total Belanja minimal Rp. 2.000.000, untuk mendapatkan voucher diskon.');
    }
  };

  const formatIDR = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });

    return formatter.format(value);
  };

  return (
    <div>
      <h1>Toko Diskon</h1>
      <label>
        Total Belanja :
        <input type="tel" value={formatIDR(amount)} onChange={handleAmountChange} style={{ marginLeft: '3px' }} />
      </label>
      <div style={{ marginTop: '12px' }}>
        <button onClick={handleVoucherGeneration} disabled={loading}>
          {loading ? 'Generating Voucher...' : 'Generate Voucher'}
        </button>
        <button style={{ marginLeft: '10px' }} onClick={checkVoucherStatus} disabled={!voucher || loading}>
          {loading ? 'Checking Status...' : 'Check Status Voucher'}
        </button>
      </div>

      {voucher && (
        <div>
          <h2>Voucher <span style={{ color: 'red' }}> <u><i> Rp.10.000</i></u></span></h2>
          <p>Code : {voucher.code}</p>
          <p>Amount : {formatIDR(voucher.amount)}</p>
          <p>Expiration Date : {voucher.expirationDate}</p>
          <button style={{ marginTop: '10px' }} onClick={useVoucher} disabled={!voucher || loading}>
            {loading ? 'Using Voucher...' : 'Use Voucher'}
          </button>
        </div>
      )}

      {voucherStatus && <h4 style={{ color: voucherStatus.includes('digunakan') ? 'blue' : voucherStatus.includes('masih aktif') ? 'green' : 'red' }}>{voucherStatus}</h4>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HomePage;
