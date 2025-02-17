// @ts-nocheck

'use client'

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import Select from 'react-select';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { toast } from 'react-hot-toast';
import { createContact } from '@/lib/feature/contact/contactsSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  name: string;
  email: string;
  phone: string;
  comment: string;

  country?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  comment?: string;
  country?: string;
}

const ContactForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.contact.loading,
    error: state.contact.error
  }));

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Format countries for react-select
  const countryOptions = getCountries().map(country => ({
    value: country,
    label: `${new Intl.DisplayNames(['en'], { type: 'region' }).of(country)} (+${getCountryCallingCode(country)})`,
    dialCode: getCountryCallingCode(country)
  }));

  // Custom styles for react-select (same as before)
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: '#121212',
      borderColor: state.isFocused ? '#20e202' : '#1f1f1f',
      boxShadow: state.isFocused ? '0 0 0 1px #20e202' : 'none',
      '&:hover': {
        borderColor: '#20e202'
      }
    }),
    menu: (base: any) => ({
      ...base,
      background: '#121212',
      border: '1px solid #1f1f1f'
    }),
    option: (base: any, { isFocused, isSelected }: any) => ({
      ...base,
      backgroundColor: isSelected ? '#20e202' : isFocused ? '#1f1f1f' : '#121212',
      color: isSelected ? 'white' : '#fff',
      '&:hover': {
        backgroundColor: '#1f1f1f'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#fff'
    }),
    input: (base: any) => ({
      ...base,
      color: '#fff'
    })
  };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryOption = countryOptions.find(option => option.value === data.country_code);
        if (countryOption) {
          setSelectedCountry(countryOption);
        }
      } catch (error) {
        console.error('Error detecting country:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    detectCountry();
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email';
      case 'phone':
        if (!selectedCountry) return 'Please select a country first';
        try {
          const phoneNumber = parsePhoneNumber(value, selectedCountry.value);
          return phoneNumber && phoneNumber.isValid() ? '' : 'Please enter a valid phone number';
        } catch {
          return 'Please enter a valid phone number';
        }
      case 'comment':
        return value.trim() ? '' : 'Message is required';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        errors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    if (!selectedCountry) {
      errors.country = 'Please select a country';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitStatus('idle');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (selectedCountry) {
      const asYouType = new AsYouType(selectedCountry.value);
      const formattedNumber = asYouType.input(value);
      setFormData(prev => ({ ...prev, phone: formattedNumber }));
      setFormErrors(prev => ({ ...prev, phone: validateField('phone', formattedNumber) }));
    } else {
      setFormData(prev => ({ ...prev, phone: value }));
      setFormErrors(prev => ({ ...prev, phone: 'Please select a country first' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formattedData = {
        ...formData,
        country: selectedCountry.value,
        phone: `+${selectedCountry.dialCode}${formData.phone.replace(/\D/g, '')}`
      };
      
      await dispatch(createContact(formattedData)).unwrap();
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', comment: '' });
      setFormErrors({});
      
    } catch (err) {
      setSubmitStatus('error');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 bg-gray-900 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Contact Us</h2>
          <p className="text-lg text-gray-400">
            We love to hear from you. Send us a message and we ll respond as soon as possible.
          </p>
        </div>

        {submitStatus === 'success' && (
          <Alert className="mb-6 bg-green-900 border-green-500">
            <AlertDescription className="text-green-200">
              Message sent successfully! We ll get back to you soon.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="mb-6 bg-red-900 border-red-500">
            <AlertDescription className="text-red-200">
              {error || 'Failed to send message. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`w-full px-4 py-3 bg-[#121212] border rounded-lg text-white focus:ring-2 focus:ring-[#20e202] focus:border-transparent ${
                  formErrors.name ? 'border-red-500' : 'border-gray-800'
                }`}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-3 bg-[#121212] border rounded-lg text-white focus:ring-2 focus:ring-[#20e202] focus:border-transparent ${
                  formErrors.email ? 'border-red-500' : 'border-gray-800'
                }`}
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Country Selection */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-2">
                Country
              </label>
              <Select
                id="country"
                options={countryOptions}
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                  setFormErrors(prev => ({ ...prev, country: '' }));
                }}
                isLoading={loadingLocation}
                styles={customStyles}
                className={formErrors.country ? 'border-red-500 rounded-lg' : ''}
                placeholder="Select a country"
                isDisabled={isSubmitting}
              />
              {formErrors.country && (
                <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 py-3 bg-[#121212] border border-r-0 border-gray-800 rounded-l-lg text-white">
                  {selectedCountry ? `+${selectedCountry.dialCode}` : '+'}
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`w-full px-4 py-3 bg-[#121212] border rounded-r-lg text-white focus:ring-2 focus:ring-[#20e202] focus:border-transparent ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-800'
                  }`}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Comment Field */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">
              Message
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              className={`w-full px-4 py-3 bg-[#121212] border rounded-lg text-white focus:ring-2 focus:ring-[#20e202] focus:border-transparent ${
                formErrors.comment ? 'border-red-500' : 'border-gray-800'
              }`}
              value={formData.comment}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {formErrors.comment && (
              <p className="mt-1 text-sm text-red-500">{formErrors.comment}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-[#20e202] hover:bg-[#1bc701] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20e202] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || loading}
            >
              <Send className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
