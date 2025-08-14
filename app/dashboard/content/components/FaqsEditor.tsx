'use client'

import { Faq } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FaqsEditorProps {
  faqs: Faq[]
  onChange: (faqs: Faq[]) => void
}

export default function FaqsEditor({ faqs, onChange }: FaqsEditorProps) {
  const addFaq = () => {
    const newFaq: Faq = {
      id: Date.now(),
      question: '',
      answer: '',
      category: 'application',
      popular: false
    }
    onChange([...faqs, newFaq])
  }

  const updateFaq = (index: number, field: keyof Faq, value: string | number | boolean) => {
    const updatedFaqs = [...faqs]
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value }
    onChange(updatedFaqs)
  }

  const removeFaq = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index)
    onChange(updatedFaqs)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addFaq}>Add FAQ</Button>
      </div>
      
      {faqs.map((faq, index) => (
        <Card key={faq.id || index}>
          <CardHeader>
            <CardTitle>FAQ {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question</label>
              <Input
                value={faq.question}
                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                placeholder="FAQ question"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                value={faq.answer}
                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                placeholder="FAQ answer"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={faq.category}
                  onValueChange={(value) => updateFaq(index, 'category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application">Application</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="universities">Universities</SelectItem>
                    <SelectItem value="agents">Agents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`popular-${index}`}
                  checked={faq.popular}
                  onChange={(e) => updateFaq(index, 'popular', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`popular-${index}`} className="text-sm font-medium">
                  Popular
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="destructive" onClick={() => removeFaq(index)}>
                Remove FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
