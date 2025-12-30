import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, Eye, Star, MapPin, Users, Calendar, DollarSign, X, Image, List, Clock, HelpCircle } from 'lucide-react';
import { accommodationAPI, adminAPI } from '../../utils/api';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AccommodationManagementPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [''],
    pricePerNight: '',
    totalRooms: '',
    availableRooms: '',
    amenities: [''],
    inclusions: [''],
    exclusions: [''],
    faqs: [{ question: '', answer: '' }],
    rating: 4,
    location: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accommodationsRes, bookingsRes] = await Promise.all([
        accommodationAPI.getAll(),
        adminAPI.getAccommodationBookings()
      ]);
      setAccommodations(accommodationsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'faqs' ? { question: '', answer: '' } : '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleFAQChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      images: [''],
      pricePerNight: '',
      totalRooms: '',
      availableRooms: '',
      amenities: [''],
      inclusions: [''],
      exclusions: [''],
      faqs: [{ question: '', answer: '' }],
      rating: 4,
      location: '',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        pricePerNight: parseInt(formData.pricePerNight),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        rating: parseFloat(formData.rating),
        images: formData.images.filter(img => img.trim()),
        amenities: formData.amenities.filter(amenity => amenity.trim()),
        inclusions: formData.inclusions.filter(inclusion => inclusion.trim()),
        exclusions: formData.exclusions.filter(exclusion => exclusion.trim()),
        faqs: formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim())
      };

      if (editingAccommodation) {
        await adminAPI.updateAccommodation(editingAccommodation._id, submitData);
      } else {
        await adminAPI.createAccommodation(submitData);
      }

      fetchData();
      setShowCreateModal(false);
      setEditingAccommodation(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save accommodation:', error);
    }
  };

  const handleEdit = (accommodation) => {
    setEditingAccommodation(accommodation);
    setFormData({
      name: accommodation.name || '',
      description: accommodation.description || '',
      images: accommodation.images?.length ? accommodation.images : [''],
      pricePerNight: accommodation.pricePerNight?.toString() || '',
      totalRooms: accommodation.totalRooms?.toString() || '',
      availableRooms: accommodation.availableRooms?.toString() || '',
      amenities: accommodation.amenities?.length ? accommodation.amenities : [''],
      inclusions: accommodation.inclusions?.length ? accommodation.inclusions : [''],
      exclusions: accommodation.exclusions?.length ? accommodation.exclusions : [''],
      faqs: accommodation.faqs?.length ? accommodation.faqs : [{ question: '', answer: '' }],
      rating: accommodation.rating || 4,
      location: accommodation.location || '',
      checkInTime: accommodation.checkInTime || '14:00',
      checkOutTime: accommodation.checkOutTime || '12:00',
      isActive: accommodation.isActive !== false // Default true
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this accommodation?')) {
      try {
        await adminAPI.deleteAccommodation(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete accommodation:', error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner size="sm" text="Loading accommodations..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          {}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h1 className="text-base sm:text-lg text-slate-900">Accommodations</h1>
              <p className="text-xs text-slate-600">{accommodations.length} hotels</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingAccommodation(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Hotel
            </button>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Hotels</p>
                <p className="text-sm text-slate-900">{accommodations.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Bookings</p>
                <p className="text-sm text-slate-900">{bookings.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Rooms</p>
                <p className="text-sm text-slate-900">
                  {accommodations.reduce((sum, acc) => sum + (acc.totalRooms || 0), 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Revenue</p>
                <p className="text-xs text-indigo-600">
                  {formatCurrency(bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + (b.totalAmount || 0), 0))}
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accommodations.map((accommodation) => (
              <div key={accommodation._id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-colors">
                <div className="relative mb-3">
                  <img src={accommodation.images[0]} className='w-full rounded-xl' alt="" />
                  
                  <div className={`absolute -top-2 right-2 px-2 py-1 rounded-lg border text-xs flex items-center gap-1 ${
                    accommodation.isActive 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {accommodation.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="absolute -top-2 left-2 px-2 py-1 rounded-lg border border-slate-200 flex items-center gap-1 text-xs bg-white">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span>{accommodation.rating}</span>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-slate-900 mb-1 truncate">{accommodation.name}</h3>
                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{accommodation.description}</p>
                
                <div className="flex items-center text-xs text-slate-600 mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{accommodation.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-slate-900">
                    {formatCurrency(accommodation.pricePerNight)}<span className="text-xs text-slate-600">/night</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {accommodation.availableRooms}/{accommodation.totalRooms} rooms
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEdit(accommodation)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs h-8 bg-[#005aa9]/10 hover:bg-[#005aa9]/20 text-[#005aa9] border border-[#005aa9]/20 rounded-xl transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(accommodation._id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs h-8 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {accommodations.length === 0 && (
            <div className="text-center py-12 px-4">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 mb-1">No accommodations</h3>
              <p className="text-xs text-slate-600 mb-4">Add your first hotel</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] transition-colors mx-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Hotel
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-medium text-slate-900">
                  {editingAccommodation ? 'Edit Hotel' : 'Add New Hotel'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingAccommodation(null);
                    resetForm();
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-medium">Hotel Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-medium">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 mb-1.5 font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] resize-vertical"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-slate-700 mb-1.5 font-medium">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#005aa9] rounded focus:ring-[#005aa9]"
                      />
                      Active
                    </label>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">Price/Night *</label>
                    <input
                      type="number"
                      name="pricePerNight"
                      value={formData.pricePerNight}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">Total Rooms *</label>
                    <input
                      type="number"
                      name="totalRooms"
                      value={formData.totalRooms}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">Available *</label>
                    <input
                      type="number"
                      name="availableRooms"
                      value={formData.availableRooms}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1.5 font-medium text-[13px]">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                </div>

                {}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-slate-700 mb-1.5 font-medium">
                      <Clock className="w-4 h-4" />
                      Check-in
                    </label>
                    <input
                      type="time"
                      name="checkInTime"
                      value={formData.checkInTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-slate-700 mb-1.5 font-medium">
                      <Clock className="w-4 h-4" />
                      Check-out
                    </label>
                    <input
                      type="time"
                      name="checkOutTime"
                      value={formData.checkOutTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9]"
                    />
                  </div>
                </div>

                {}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
                    <Image className="w-4 h-4" />
                    Images
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => handleArrayChange('images', index, e.target.value)}
                          placeholder={`Image URL ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm"
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('images', index)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs bg-[#005aa9]/10 hover:bg-[#005aa9]/20 text-[#005aa9] rounded-xl transition-colors border border-[#005aa9]/20"
                  >
                    <Plus className="w-3 h-3" />
                    Add Image
                  </button>
                </div>

                {}
                {[['amenities', 'Amenities', List], ['inclusions', 'Inclusions', List], ['exclusions', 'Exclusions', List]].map(([field, label, Icon]) => (
                  <div key={field}>
                    <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
                      <Icon className="w-4 h-4" />
                      {label}
                    </label>
                    <div className="space-y-2 max-h-24 overflow-y-auto pr-1">
                      {formData[field].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange(field, index, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()} ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm"
                          />
                          {formData[field].length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem(field, index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayItem(field)}
                      className="flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs bg-[#005aa9]/10 hover:bg-[#005aa9]/20 text-[#005aa9] rounded-xl transition-colors border border-[#005aa9]/20"
                    >
                      <Plus className="w-3 h-3" />
                      Add {label.slice(0, -1)}
                    </button>
                  </div>
                ))}

                {}
                <div>
                  <label className="flex items-center gap-2 text-slate-700 mb-2 font-medium">
                    <HelpCircle className="w-4 h-4" />
                    FAQs
                  </label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                    {formData.faqs.map((faq, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-700">FAQ {index + 1}</span>
                          {formData.faqs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('faqs', index)}
                              className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                          placeholder="Question"
                          className="w-full px-3 py-2 mb-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm"
                        />
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                          placeholder="Answer"
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005aa9] focus:border-[#005aa9] text-sm resize-none"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('faqs')}
                    className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs bg-[#005aa9]/10 hover:bg-[#005aa9]/20 text-[#005aa9] rounded-xl transition-colors border border-[#005aa9]/20"
                  >
                    <Plus className="w-3 h-3" />
                    Add FAQ
                  </button>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 h-11 bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] transition-all font-medium shadow-sm hover:shadow-md"
                  >
                    {editingAccommodation ? 'Update Hotel' : 'Create Hotel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingAccommodation(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 h-11 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationManagementPage;
