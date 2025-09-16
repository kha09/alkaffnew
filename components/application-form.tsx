'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/ui/file-upload'
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  FilePlus,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { FormSubmission } from '@/lib/types'

interface ApplicationFormProps {
  universityId?: number
  programId?: number
  onClose: () => void
}

export function ApplicationForm({ universityId, programId, onClose }: ApplicationFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    email: '',
    countryOfResidence: '',
    contactNumber: '',
    cityOfResidence: '',
    preferredProgram: '',
  })
  
  const [files, setFiles] = useState({
    highSchoolCertificate: null as File | null,
    personalPhoto: null as File | null,
    passport: null as File | null,
    additionalDocuments: null as File | null,
  })
  
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  const fileInputRefs = {
    highSchoolCertificate: useRef<HTMLInputElement>(null),
    personalPhoto: useRef<HTMLInputElement>(null),
    passport: useRef<HTMLInputElement>(null),
    additionalDocuments: useRef<HTMLInputElement>(null),
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [name]: file }))
  }

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const validateStep1 = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.nationality.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.countryOfResidence.trim() !== '' &&
      formData.contactNumber.trim() !== '' &&
      formData.cityOfResidence.trim() !== '' &&
      formData.preferredProgram.trim() !== ''
    )
  }

  const validateStep2 = () => {
    return (
      files.highSchoolCertificate !== null &&
      files.personalPhoto !== null &&
      files.passport !== null &&
      termsAccepted
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      setSubmitError('يرجى ملء جميع الحقول المطلوبة وقبول الشروط والأحكام')
      return
    }
    
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      // Create FormData object to send files and form data
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('fullName', formData.fullName)
      formDataToSend.append('nationality', formData.nationality)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('countryOfResidence', formData.countryOfResidence)
      formDataToSend.append('contactNumber', formData.contactNumber)
      formDataToSend.append('cityOfResidence', formData.cityOfResidence)
      formDataToSend.append('preferredProgram', formData.preferredProgram)
      
      // Add universityId and programId if provided
      if (universityId) {
        formDataToSend.append('universityId', universityId.toString())
      }
      
      if (programId) {
        formDataToSend.append('programId', programId.toString())
      }
      
      // Add files
      if (files.highSchoolCertificate) {
        formDataToSend.append('highSchoolCertificate', files.highSchoolCertificate)
      }
      
      if (files.personalPhoto) {
        formDataToSend.append('personalPhoto', files.personalPhoto)
      }
      
      if (files.passport) {
        formDataToSend.append('passport', files.passport)
      }
      
      if (files.additionalDocuments) {
        formDataToSend.append('additionalDocuments', files.additionalDocuments)
      }
      
      // Submit form data
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        body: formDataToSend,
      })
      
      if (!response.ok) {
        throw new Error('فشل في إرسال الطلب')
      }
      
      setSubmitSuccess(true)
      // Reset form after successful submission
      setFormData({
        fullName: '',
        nationality: '',
        email: '',
        countryOfResidence: '',
        contactNumber: '',
        cityOfResidence: '',
        preferredProgram: '',
      })
      
      setFiles({
        highSchoolCertificate: null,
        personalPhoto: null,
        passport: null,
        additionalDocuments: null,
      })
      
      setTermsAccepted(false)
    } catch (error) {
      setSubmitError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.')
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">تم إرسال الطلب بنجاح!</h3>
              <p className="text-muted-foreground mb-6">
                شكراً لك على تقديم طلبك. سيتم مراجعة طلبك من قبل فريقنا وسنتواصل معك قريباً.
              </p>
              <Button onClick={onClose} className="w-full">
                إغلاق
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              {step === 1 ? 'معلومات المتقدم' : 'تحميل المستندات'}
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              إغلاق
            </Button>
          </div>
          
          {/* Progress indicators */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-24 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
              <span className="text-red-700">{submitError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="nationality">الجنسية *</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="countryOfResidence">بلد الإقامة *</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="countryOfResidence"
                        name="countryOfResidence"
                        value={formData.countryOfResidence}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contactNumber">رقم التواصل *</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cityOfResidence">مدينة الإقامة *</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="cityOfResidence"
                        name="cityOfResidence"
                        value={formData.cityOfResidence}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="preferredProgram">التخصص المفضل *</Label>
                    <div className="relative">
                      <BookOpen className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="preferredProgram"
                        name="preferredProgram"
                        value={formData.preferredProgram}
                        onChange={handleInputChange}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div></div> {/* Empty div for spacing */}
                  <Button type="button" onClick={nextStep} disabled={!validateStep1()}>
                    التالي
                    <ChevronLeft className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label>شهادة المرحلة الثانوية أو ما يعادلها *</Label>
                    <FileUpload
                      label="شهادة المرحلة الثانوية"
                      value={files.highSchoolCertificate || ''}
                      onChange={(file) => handleFileChange('highSchoolCertificate', file as File | null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      placeholder="اختر ملف الشهادة"
                    />
                  </div>
                  
                  <div>
                    <Label>صورة شخصية على خلفية بيضاء *</Label>
                    <FileUpload
                      label="الصورة الشخصية"
                      value={files.personalPhoto || ''}
                      onChange={(file) => handleFileChange('personalPhoto', file as File | null)}
                      accept=".jpg,.jpeg,.png"
                      placeholder="اختر الصورة الشخصية"
                    />
                  </div>
                  
                  <div>
                    <Label>صفحة جواز السفر *</Label>
                    <FileUpload
                      label="جواز السفر"
                      value={files.passport || ''}
                      onChange={(file) => handleFileChange('passport', file as File | null)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      placeholder="اختر صفحة جواز السفر"
                    />
                  </div>
                  
                  <div>
                    <Label>مستندات إضافية</Label>
                    <FileUpload
                      label="مستندات إضافية"
                      value={files.additionalDocuments || ''}
                      onChange={(file) => handleFileChange('additionalDocuments', file as File | null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      placeholder="اختر أي مستندات إضافية"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    أوافق على الشروط والأحكام وسياسة الخصوصية *
                  </Label>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronRight className="ml-2 h-4 w-4" />
                    السابق
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
