'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import JRGrahamLayout from '@/components/JRGrahamLayout'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Calendar,
  Users,
  ArrowRight,
  Send,
  CheckCircle,
  Star,
  Quote
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', eventType: '', message: '' })
    }, 2000)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const testimonials = [
    {
      name: 'Community Cookout',
      event: 'Annual Church Picnic',
      quote: 'Our Event was Great!',
      rating: 5
    },
    {
      name: 'Group Exercise',
      event: 'Weekly Fitness Class',
      quote: 'Awesome!',
      rating: 5
    },
    {
      name: 'Baby Shower',
      event: 'Family Celebration',
      quote: 'Successful Event',
      rating: 5
    }
  ]

  return (
    <JRGrahamLayout currentPage="contact">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Any questions you have can be resolved here
          </p>
          <p className="text-lg opacity-80">
            Reach out, and let's find the right solution together
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
              <a 
                href="tel:804-462-9011" 
                className="text-lg text-purple-600 hover:text-purple-700 font-medium"
              >
                804-462-9011
              </a>
              <p className="text-gray-600 mt-2 text-sm">
                Call us during business hours for immediate assistance
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <a 
                href="mailto:info@jrgrahamcenter.org" 
                className="text-lg text-purple-600 hover:text-purple-700 font-medium"
              >
                info@jrgrahamcenter.org
              </a>
              <p className="text-gray-600 mt-2 text-sm">
                Send us an email and we'll respond within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-lg text-gray-800 font-medium">
                3989 White Chapel Road
              </p>
              <p className="text-lg text-gray-800 font-medium">
                Lively, VA 22507
              </p>
              <p className="text-gray-600 mt-2 text-sm">
                Visit us to tour our facilities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Can we help?</CardTitle>
                <p className="text-gray-600">
                  Send us a message and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-purple-600 text-purple-600"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="(804) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Type
                        </label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select event type</option>
                          <option value="wedding">Wedding</option>
                          <option value="conference">Conference/Meeting</option>
                          <option value="church">Church Event</option>
                          <option value="community">Community Event</option>
                          <option value="celebration">Celebration/Party</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Tell us about your event, preferred dates, number of guests, and any special requirements..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/booking">
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <Calendar className="w-8 h-8 text-purple-600 mr-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Book a Space</h4>
                      <p className="text-sm text-gray-600">Reserve your event space online</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-600 ml-auto" />
                  </div>
                </Link>
                
                <Link href="/availability">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    <Clock className="w-8 h-8 text-blue-600 mr-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Check Availability</h4>
                      <p className="text-sm text-gray-600">See what dates are open</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 ml-auto" />
                  </div>
                </Link>
                
                <a href="tel:804-462-9011">
                  <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                    <Phone className="w-8 h-8 text-green-600 mr-4" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Now</h4>
                      <p className="text-sm text-gray-600">Speak with us directly</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600 ml-auto" />
                  </div>
                </a>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Saturday</span>
                    <span className="font-medium">10:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Sunday</span>
                    <span className="font-medium">By Appointment</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Event spaces are available 7 days a week. 
                    Contact us to arrange access outside business hours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>They say it better than we do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <div className="flex items-center mb-2">
                      <Quote className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="font-semibold text-gray-900">{testimonial.quote}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.event}</p>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Find Us</CardTitle>
              <p className="text-gray-600">
                Located in the heart of Lively, Virginia, easily accessible from all areas of the Northern Neck.
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Joseph R. Graham Center
                </h3>
                <p className="text-gray-700 mb-4">
                  3989 White Chapel Road<br />
                  Lively, VA 22507
                </p>
                <a 
                  href="https://www.google.com/maps/search/3989+White+Chapel+Road,+Lively,+VA+22507"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Get Directions
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </JRGrahamLayout>
  )
}
