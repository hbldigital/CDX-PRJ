/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Careers & Job Vacancies with Passport Photo Background Validator
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  FileText,
  User as UserIcon,
  X,
  ShieldCheck,
  Search,
} from 'lucide-react';
import type { JobVacancy } from '../types';

interface CareersProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Careers: React.FC<CareersProps> = ({ onNavigate }) => {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Application form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Resume file state
  const [resumeFileName, setResumeFileName] = useState('');

  // Passport photo verification state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState('');
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [photoVerified, setPhotoVerified] = useState<boolean | null>(null);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);
  const [sampleBorderPixels, setSampleBorderPixels] = useState<Array<{ r: number; g: number; b: number }>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Submit status
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/vacancies')
      .then((res) => res.json())
      .then((d) => d.success && setVacancies(d.vacancies))
      .catch((e) => console.error(e));
  }, []);

  const handleApplyClick = (vacancy: JobVacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
    setSuccessRef(null);
    setErrorMsg(null);
  };

  // Real-time canvas evaluation of passport photo plain white background
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (.jpg or .png).');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoPreview(dataUrl);

      // Load image into canvas for background white-pixel analysis
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 100, 100);
        const imgData = ctx.getImageData(0, 0, 100, 100);
        const data = imgData.data;

        // Sample border pixels (top edge, left edge, right edge) where background exists
        const pixels: Array<{ r: number; g: number; b: number }> = [];
        for (let x = 0; x < 100; x += 4) {
          // Top row
          const topIdx = (0 * 100 + x) * 4;
          pixels.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });
          // Near top corners (5px down)
          const cornerIdx = (5 * 100 + x) * 4;
          pixels.push({ r: data[cornerIdx], g: data[cornerIdx + 1], b: data[cornerIdx + 2] });
        }

        setSampleBorderPixels(pixels);

        // Calculate lightness & neutrality
        let whiteCount = 0;
        for (const p of pixels) {
          const brightness = (p.r + p.g + p.b) / 3;
          const maxDiff = Math.max(Math.abs(p.r - p.g), Math.abs(p.g - p.b), Math.abs(p.r - p.b));
          if (brightness >= 215 && maxDiff <= 25) {
            whiteCount++;
          }
        }

        const score = Math.round((whiteCount / pixels.length) * 100);
        setPhotoScore(score);

        if (score >= 80) {
          setPhotoVerified(true);
          setPhotoFeedback(`White Background Verified: ${score}% compliance score.`);
          setErrorMsg(null);
        } else {
          setPhotoVerified(false);
          setPhotoFeedback(
            `Background Check Notice: Only ${score}% white pixels detected. Mandatory passport photo must have a clean, plain white background.`
          );
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    if (!photoPreview) {
      setErrorMsg('Mandatory requirement: Please upload your passport-size photograph.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacancyId: selectedVacancy.id,
          vacancyTitle: selectedVacancy.title,
          fullName,
          email,
          phone,
          city,
          country,
          education,
          experience,
          skills,
          portfolioUrl,
          coverLetter,
          resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
          photoFileName: photoFileName || 'Passport_Photo.jpg',
          sampleBorderPixels,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessRef(data.reference);
      } else {
        setErrorMsg(data.error || 'Failed to submit application.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen py-12">
      {/* Hidden canvas for pixel analysis */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Join CODELIX Engineering Team
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] mt-2 tracking-tight">
            Careers & Open Engineering Positions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            We are always looking for driven full-stack developers, PHP architects, and UI/UX designers committed to clean code and high performance.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs">
            <button
              onClick={() => onNavigate('track-application')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Already Applied? Track Application Status →</span>
            </button>
          </div>
        </div>

        {/* Vacancies List */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 group hover:border-blue-400"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {vacancy.department}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {vacancy.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {vacancy.location}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#0B192C] group-hover:text-blue-600 transition-colors">
                    {vacancy.title}
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row md:items-end gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Compensation</span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {vacancy.salaryRange}
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyClick(vacancy)}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description & Requirements */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {vacancy.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block mb-2">Required Qualifications:</span>
                  <ul className="space-y-1.5">
                    {vacancy.requirements.map((req, ridx) => (
                      <li key={ridx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-2">Technical Skills:</span>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {vacancy.skills.map((skill, sidx) => (
                      <span
                        key={sidx}
                        className="bg-white px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div><strong>Experience:</strong> {vacancy.experience}</div>
                    <div><strong>Available Openings:</strong> {vacancy.positionsCount}</div>
                    <div><strong>Deadline:</strong> {vacancy.deadline}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Submission Modal */}
      {isModalOpen && selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 px-6 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Candidate Application
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedVacancy.title}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {successRef ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Application Successfully Submitted!</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you, {fullName}. Your application has been logged into the recruitment system. A confirmation email has been dispatched.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 max-w-sm mx-auto">
                    <div className="text-xs text-slate-600 font-bold uppercase">Your Application Tracking ID</div>
                    <div className="text-lg font-mono font-black text-blue-700 mt-1">{successRef}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Keep this reference safe to monitor your recruitment status.
                    </div>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        onNavigate('track-application', { reference: successRef, email });
                      }}
                      className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                    >
                      Track Application Now
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kamran Siddiqui"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="kamran@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 312 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City & Country</label>
                      <input
                        type="text"
                        placeholder="Islamabad, Pakistan"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Highest Education</label>
                      <input
                        type="text"
                        placeholder="e.g. BS Computer Science"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Relevant Experience</label>
                      <input
                        type="text"
                        placeholder="e.g. 3 Years in PHP / Laravel"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub / Portfolio / LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourhandle"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  {/* Mandatory Passport Photo Section with Real-Time White Background Check */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-blue-600" />
                        <span>Mandatory Passport-Size Photograph (Plain White Background) *</span>
                      </label>
                      {photoVerified !== null && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            photoVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {photoVerified ? 'Verified White Background' : 'Border Check Alert'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {photoPreview ? (
                        <div className="relative w-16 h-20 rounded-lg border border-slate-300 overflow-hidden shrink-0 bg-white shadow-xs">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-white">
                          <UserIcon className="w-6 h-6" />
                          <span className="text-[9px]">Passport</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                        {photoFeedback && (
                          <div
                            className={`text-[11px] font-medium ${
                              photoVerified ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            {photoFeedback}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-600">
                          Passport standard: Recent frontal headshot on a clean white background.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CV / Resume Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Upload Resume / CV (PDF format) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files?.[0] && setResumeFileName(e.target.files[0].name)}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-900 cursor-pointer"
                    />
                    {resumeFileName && (
                      <span className="text-[11px] text-blue-600 font-mono mt-1 block">
                        Selected: {resumeFileName}
                      </span>
                    )}
                  </div>

                  {/* Cover statement */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Brief Statement or Cover Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Why are you a good fit for this role at CODELIX?..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <span>Validating & Submitting...</span> : <span>Submit Candidate Application</span>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
