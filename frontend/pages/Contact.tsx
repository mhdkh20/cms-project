import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus('submitting');

  try {
    await api.post('/contact', formData);
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    console.error(error);
    setStatus('error');
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in touch</h1>
        <p className="text-gray-600 mb-8">
          Have a question or want to work together? Fill out the form and we'll get back to you as soon as possible.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4 text-gray-700">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
               <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email us</p>
              <p className="font-semibold">contact@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-700">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
               <Phone size={24} />
            </div>
             <div>
              <p className="text-sm text-gray-500 font-medium">Call us</p>
              <p className="font-semibold">+1 (555) 000-0000</p>
            </div>
          </div>
           <div className="flex items-center gap-4 text-gray-700">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
               <MapPin size={24} />
            </div>
             <div>
              <p className="text-sm text-gray-500 font-medium">Visit us</p>
              <p className="font-semibold">123 Web Dev Lane, Internet City</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl">
        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
            <p className="text-gray-600 mt-2">Thank you for reaching out. We will respond shortly.</p>
            <button onClick={() => setStatus('idle')} className="mt-6 text-primary font-medium hover:underline">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"></textarea>
            </div>
            
            {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}
            
            <button type="submit" disabled={status === 'submitting'} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50">
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;