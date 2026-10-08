import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/AnimatedSection';
import { donationAPI } from '../services/api';

const predefinedAmounts = [500, 1000, 2500, 5000];

export default function Donate() {
  const [amount, setAmount] = useState<number | ''>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [purpose, setPurpose] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(val ? Number(val) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      toast.error('Please enter a valid amount (minimum ₹1)');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order on our backend
      const { data: orderData } = await donationAPI.createOrder({
        ...formData,
        amount,
        purpose,
        isAnonymous,
      });

      if (orderData.success) {
        // In a real app, this is where you would initialize Razorpay
        // For this demo, we'll simulate a successful payment after 2 seconds
        toast.loading('Processing payment securely...', { duration: 2000 });
        
        setTimeout(async () => {
          // Simulate verification
          await donationAPI.verify({
            orderId: orderData.order.id,
            paymentId: 'pay_mock_' + Math.floor(Math.random() * 1000000),
            signature: 'mock_signature',
            donationId: orderData.donation,
          });
          
          setIsSubmitting(false);
          setIsSuccess(true);
          toast.success('Donation successful! Thank you.');
        }, 2000);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || 'Failed to process donation. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <section className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50">
        <Helmet>
          <title>Thank You — Mahamana Hopes Foundation</title>
        </Helmet>
        <div className="container-max max-w-lg">
          <AnimatedSection>
            <div className="card p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-primary-500 mb-4">
                Thank You for Your Generosity!
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your donation of ₹{amount} towards {purpose === 'general' ? 'our general fund' : purpose} has been received successfully. A receipt has been sent to {formData.email}.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ donorName: '', email: '', phone: '', message: '' });
                  setAmount(1000);
                }}
                className="btn btn-outline w-full"
              >
                Make Another Donation
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Donate — Mahamana Hopes Foundation</title>
        <meta name="description" content="Your contribution can create a lasting impact. Donate to Mahamana Hopes Foundation today." />
      </Helmet>

      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container-max max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Info */}
            <AnimatedSection direction="left">
              <div className="sticky top-32">
                <span className="section-label">Support Our Cause</span>
                <h1 className="text-4xl lg:text-5xl font-heading font-bold text-primary-500 mb-6">
                  Your contribution can create a <span className="text-green-600">lasting impact.</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Every donation, no matter the size, helps us bring education to the underprivileged, healthcare to the needy, and protection to our environment.
                </p>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                  <h3 className="font-heading font-bold text-lg text-primary-500 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" /> Why donate to us?
                  </h3>
                  <ul className="space-y-3">
                    {['100% Transparency in fund utilization', 'Direct impact on local communities', 'Tax exemption benefits under Section 80G', 'Regular updates on how your money is used'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-600 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium bg-gray-100 px-4 py-3 rounded-lg">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Secure payment processing
                </div>
              </div>
            </AnimatedSection>

            {/* Right Form */}
            <AnimatedSection direction="right">
              <div className="card p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="input-label mb-3">Select Donation Amount (₹)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {predefinedAmounts.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAmountClick(val)}
                          className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                            amount === val && !customAmount
                              ? 'border-primary-500 bg-primary-50 text-primary-600'
                              : 'border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-gray-50'
                          }`}
                        >
                          ₹{val}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Custom Amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="input-field pl-8"
                      />
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="input-label mb-3">Donation Purpose</label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="general">General Fund (Where it's needed most)</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="environment">Environment</option>
                    </select>
                  </div>

                  <div className="w-full h-px bg-gray-100" />

                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-primary-500">Your Details</h3>
                    
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input
                        type="text"
                        name="donorName"
                        value={formData.donorName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="input-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Message (Optional)</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="input-field resize-none h-24"
                        placeholder="Leave a message with your donation..."
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-500/20 focus:outline-none checked:border-primary-500 checked:bg-primary-500 transition-all cursor-pointer"
                        />
                        <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Make this donation anonymous
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-green w-full !py-4 text-base ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing...' : `Donate ₹${amount || 0} Securely`}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    By donating, you agree to our Terms & Conditions and Privacy Policy.
                  </p>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
