import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import apiService from '@/services/api';

export default function ImageUpload({ value, onChange, label = "Profile Image" }) {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (showModal) {
      loadUserImages();
    }
  }, [showModal]);

  const loadUserImages = async () => {
    try {
      const result = await apiService.getUserImages();
      console.log('API Response:', result);
      setUserImages(result.images || []);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await apiService.uploadImage(selectedFile);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Update the form value
      onChange(result.imageUrl);
      
      // Reload images
      await loadUserImages();
      
      // Reset
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (imageUrl) => {
    onChange(imageUrl);
    setShowModal(false);
  };

  const handleDeleteImage = async (filename) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await apiService.deleteUserImage(filename);
      await loadUserImages();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete image');
    }
  };

  const getImageUrl = (imageUrl) => {
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        <div className="flex items-center space-x-3">
          {value ? (
            <div className="relative">
              <img
                src={getImageUrl(value)}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {value ? 'Change Image' : 'Add Image'}
          </button>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Images</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">Upload New Image</h4>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {selectedFile && (
                  <div className="flex items-center space-x-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}

                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            <div>
              <h4 className="font-medium mb-3">Your Images</h4>
              {userImages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
              ) : (
                                <div className="grid grid-cols-3 gap-4">
                  {userImages.map((image) => {
                    const imageUrl = getImageUrl(image.url);
                    console.log('Rendering image:', { filename: image.filename, url: image.url, fullUrl: imageUrl });
                    return (
                      <div key={image.filename} className="relative group">
                        <img
                          src={imageUrl}
                          alt="User uploaded"
                          className="w-full h-24 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500"
                          onClick={() => handleImageSelect(image.url)}
                          onError={(e) => console.error('Image failed to load:', imageUrl, e)}
                        />
                        <button
                          onClick={() => handleDeleteImage(image.filename)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {value === image.url && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              Selected
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
