import React, { useState } from 'react';
import { Upload, FileVideo, CheckCircle, AlertCircle, Loader, User, Clock, AlertTriangle } from 'lucide-react';
import { API_V1_URL } from '../config/api';

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime'];
      if (!validFormats.includes(file.type)) {
        setError('Formato no soportado. Use MP4, AVI o MOV');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_V1_URL}/video/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Error al subir video');
      }

      setAnalysis(data);
      setVideoId(data.video_id);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const getRiskColor = (risk_level) => {
    switch (risk_level?.toLowerCase()) {
      case 'crítico':
        return 'bg-red-900/30 border-red-700/50 text-red-300';
      case 'alto':
        return 'bg-orange-900/30 border-orange-700/50 text-orange-300';
      case 'medio':
        return 'bg-yellow-900/30 border-yellow-700/50 text-yellow-300';
      case 'bajo':
        return 'bg-green-900/30 border-green-700/50 text-green-300';
      default:
        return 'bg-gray-900/30 border-gray-700/50 text-gray-300';
    }
  };

  const getRiskBadgeColor = (risk_level) => {
    switch (risk_level?.toLowerCase()) {
      case 'crítico':
        return 'bg-red-600 text-red-100';
      case 'alto':
        return 'bg-orange-600 text-orange-100';
      case 'medio':
        return 'bg-yellow-600 text-yellow-100';
      case 'bajo':
        return 'bg-green-600 text-green-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Análisis de Video con Tracking de Personas</h2>
        <p className="text-gray-400">Sube un video para análisis de detección de personas con identificación y contador de tiempo</p>
      </div>

      {/* Upload Area */}
      {!videoId && (
        <div className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 p-8">
          <div className="text-center">
            <FileVideo className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            
            <input
              type="file"
              accept="video/mp4,video/avi,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
            />
            
            <label
              htmlFor="video-upload"
              className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Upload className="w-5 h-5" />
              Seleccionar Video
            </label>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-300 mb-3">
                  <strong>Archivo:</strong> {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 mx-auto"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Analizar Video
                    </>
                  )}
                </button>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Formatos soportados: MP4, AVI, MOV (máx 500MB)
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Error</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && videoId && (
        <div className="space-y-6">
          {/* Video Player */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                controls
                className="w-full h-full"
                src={`${API_V1_URL}/video/video/${videoId}`}
              />
            </div>
          </div>

          {/* Video Info and Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-xs text-gray-400 mb-2">Duración Total</p>
              <p className="text-2xl font-bold text-white">
                {Math.floor(analysis.video_info?.duration_seconds / 60)}m {Math.floor(analysis.video_info?.duration_seconds % 60)}s
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <p className="text-xs text-gray-400 mb-2">Total de Personas</p>
              <p className="text-2xl font-bold text-blue-400">
                {analysis.summary?.total_persons || 0}
              </p>
            </div>
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
              <p className="text-xs text-red-300 mb-2">Personas en Riesgo</p>
              <p className="text-2xl font-bold text-red-400">
                {analysis.summary?.high_risk_persons || 0}
              </p>
            </div>
          </div>

          {/* Tracked Persons Panel */}
          {analysis.summary?.persons_tracked && analysis.summary.persons_tracked.length > 0 && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personas Detectadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.summary.persons_tracked.map((person, idx) => {
                  const isHighRisk = person.risk_level === 'crítico' || person.risk_level === 'alto';
                  
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg border p-4 transition ${getRiskColor(person.risk_level)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg text-white">{person.name}</p>
                          <p className="text-sm text-gray-300">ID: {person.person_id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadgeColor(person.risk_level)}`}>
                          {person.risk_level.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            Tiempo: <strong>{person.duration_formatted}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            Frames: <strong>{person.frames_detected}</strong>
                          </span>
                        </div>

                        {isHighRisk && (
                          <div className="flex items-start gap-2 text-sm pt-2 border-t border-gray-600">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-red-300">
                              <strong>Alerta:</strong> Permanencia prolongada detectada
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
              <p className="text-xs text-gray-400 mb-1">FPS</p>
              <p className="text-lg font-bold text-white">{analysis.video_info?.fps}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
              <p className="text-xs text-gray-400 mb-1">Resolución</p>
              <p className="text-lg font-bold text-white">{analysis.video_info?.width}x{analysis.video_info?.height}</p>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-3">
              <p className="text-xs text-gray-400 mb-1">Total Frames</p>
              <p className="text-lg font-bold text-white">{analysis.video_info?.total_frames}</p>
            </div>
            <div className="bg-orange-900/30 border border-orange-700/50 rounded-lg p-3">
              <p className="text-xs text-orange-300 mb-1">Frames Riesgo</p>
              <p className="text-lg font-bold text-orange-400">{analysis.summary?.high_risk_frames || 0}</p>
            </div>
          </div>

          {/* New Upload Button */}
          <button
            onClick={() => {
              setAnalysis(null);
              setVideoId(null);
              setSelectedFile(null);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Analizar Otro Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
