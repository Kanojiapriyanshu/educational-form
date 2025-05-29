import React, { useRef, useState } from 'react';
import { FiPhone, FiPrinter, FiMail } from 'react-icons/fi';
import logo from '../assets/logo.png';
import toast, { Toaster } from 'react-hot-toast';

const UniversityForm = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Validate file size (5MB limit)
    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files exceed 5MB limit and were not added');
    }
    setFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !formRef.current[field]?.value);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Collect education details
      const educationDetails = Array.from({ length: 4 }, (_, i) => ({
        name: formRef.current[`school${i}Name`]?.value || '',
        qualification: formRef.current[`school${i}Qualification`]?.value || '',
        board: formRef.current[`school${i}Board`]?.value || '',
        year: formRef.current[`school${i}Year`]?.value || '',
        grade: formRef.current[`school${i}Grade`]?.value || '',
        backlogs: formRef.current[`school${i}Backlogs`]?.value || ''
      }));

      // Create FormData
      const formData = new FormData();
      
      // Add form fields
      formData.append('firstName', formRef.current.firstName.value);
      formData.append('lastName', formRef.current.lastName.value);
      formData.append('month', formRef.current.month.value);
      formData.append('day', formRef.current.day.value);
      formData.append('year', formRef.current.year.value);
      formData.append('email', formRef.current.email.value);
      formData.append('phone', formRef.current.phone.value);
      formData.append('address', formRef.current.address.value);
      formData.append('city', formRef.current.city.value);
      formData.append('state', formRef.current.state.value);
      formData.append('postalCode', formRef.current.postalCode.value);
      formData.append('country', formRef.current.country.value);
      formData.append('emergencyName', formRef.current.emergencyName.value);
      formData.append('emergencyRelation', formRef.current.emergencyRelation.value);
      formData.append('emergencyPhone', formRef.current.emergencyPhone.value);
      formData.append('emergencyEmail', formRef.current.emergencyEmail.value);
      formData.append('emergencyAddress', formRef.current.emergencyAddress.value);
      formData.append('educationDetails', JSON.stringify(educationDetails));

      // Add files
      files.forEach(file => {
        formData.append('documents', file);
      });

      // Send to backend
      const response = await fetch('http://localhost:5000/send', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to submit form');
      }

      toast.success('Application submitted successfully!');
      formRef.current.reset();
      setFiles([]);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-yellow-500 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="UNINXT Logo" className="w-24 sm:w-32" />
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-black font-semibold">
              <div className="flex items-center gap-2">
                <FiPhone className="text-lg" />
                <span className="whitespace-nowrap">+91 - 96542 23759</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPrinter className="text-lg" />
                <span className="whitespace-nowrap">01245181193</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="text-lg" />
                <span className="whitespace-nowrap">info@uninxt.com</span>
              </div>
            </div>
          </div>
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Application for University</h2>
            <p className="text-gray-600 text-sm">Please fill out the application form carefully</p>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium">Full Name</label>
                <input
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  required
                />
                <span className="text-xs text-gray-500">First Name</span>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium invisible">Last Name</label>
                <input
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
                <span className="text-xs text-gray-500">Last Name</span>
              </div>
            </div>

            {/* Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-gray-700 text-sm font-medium">Birth Date</label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    name="month"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option className="bg-white text-gray-700">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-white text-gray-700 hover:bg-gray-100">
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    name="day"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option className="bg-white text-gray-700">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-white text-gray-700 hover:bg-gray-100">
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="year"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option className="bg-white text-gray-700">Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year} className="bg-white text-gray-700 hover:bg-gray-100">
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>Month</span><span>Day</span><span>Year</span>
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium">E-mail</label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="ex: myname@example.com"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
                <span className="text-xs text-gray-500">example@example.com</span>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-medium">Phone Number</label>
                <input
                  name="phone"
                  id="phone"
                  type="text"
                  placeholder="(000) 000-0000"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <label htmlFor="address" className="block text-gray-700 text-sm font-medium">Address</label>
              <input
                name="address"
                id="address"
                type="text"
                placeholder="Street Address"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="addressLine2"
                type="text"
                placeholder="Street Address Line 2"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="city"
                type="text"
                placeholder="City"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                name="state"
                type="text"
                placeholder="State / Province"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="postalCode"
                type="text"
                placeholder="Postal / Zip Code"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                name="country"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option className="bg-white text-gray-700">Country</option>
                <option value="USA" className="bg-white text-gray-700 hover:bg-gray-100">United States</option>
                <option value="Canada" className="bg-white text-gray-700 hover:bg-gray-100">Canada</option>
                <option value="UK" className="bg-white text-gray-700 hover:bg-gray-100">United Kingdom</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>

          {/* Emergency Contact Details */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">Emergency Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="emergencyName" className="block text-gray-700 text-sm font-medium">Emergency Contact Name</label>
                <input
                  name="emergencyName"
                  id="emergencyName"
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="emergencyRelation" className="block text-gray-700 text-sm font-medium">Relationship</label>
                <select
                  name="emergencyRelation"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Relationship</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="spouse">Spouse</option>
                  <option value="relative">Relative</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="emergencyPhone" className="block text-gray-700 text-sm font-medium">Emergency Contact Phone</label>
                <input
                  name="emergencyPhone"
                  id="emergencyPhone"
                  type="tel"
                  placeholder="(000) 000-0000"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="emergencyEmail" className="block text-gray-700 text-sm font-medium">Emergency Contact Email</label>
                <input
                  name="emergencyEmail"
                  id="emergencyEmail"
                  type="email"
                  placeholder="example@example.com"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="emergencyAddress" className="block text-gray-700 text-sm font-medium">Emergency Contact Address</label>
              <input
                name="emergencyAddress"
                id="emergencyAddress"
                type="text"
                placeholder="Street Address"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Education Background */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">Education Background</h3>
            <p className="text-sm text-gray-600">List your previous schools, beginning with the most recent</p>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300 text-sm rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="border-b border-gray-300 px-4 py-2 text-gray-700">Name of School/College</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-gray-700">Qualification</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-gray-700">Board</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-gray-700">Year Attended</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-gray-700">Grade</th>
                    <th className="border-b border-gray-300 px-4 py-2 text-gray-700">No. of Backlogs</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {[1, 2, 3, 4].map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <input
                          name={`school${i}Name`}
                          type="text"
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-700"
                          placeholder="e.g. St. Xavier's High School"
                        />
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <input
                          name={`school${i}Qualification`}
                          type="text"
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-700"
                          placeholder="e.g. SSC / HSC / Bachelors"
                        />
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <select
                          name={`school${i}Board`}
                          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Board</option>
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="State Board">State Board</option>
                        </select>
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <input
                          name={`school${i}Year`}
                          type="text"
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-700"
                          placeholder="e.g. 2018 - 2021"
                        />
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <input
                          name={`school${i}Grade`}
                          type="text"
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-700"
                          placeholder="e.g. A+ / 85%"
                        />
                      </td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <input
                          name={`school${i}Backlogs`}
                          type="number"
                          min="0"
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-700"
                          placeholder="e.g. 0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">Upload Documents</h3>
            <p className="text-sm text-gray-600">Please upload the required documents in PDF or image format (Max size: 5MB each)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '10th Marksheets',
                '12th Marksheets',
                'Bachelors Marksheets',
                'Bachelors Degree',
                'Masters Marksheets',
                'Masters Degree',
                'Statement of Purpose (SOP)',
                'Letter of Recommendation (LOR)',
                'Copy of Passport',
                'Resume',
                'Additional Document',
              ].map((label, i) => (
                <div key={i}>
                  <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    multiple
                    className="block w-full text-sm text-gray-700
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition-all duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Apply Now!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityForm;
