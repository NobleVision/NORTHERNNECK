'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import JRGrahamLayout from '@/components/JRGrahamLayout'
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  Heart,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const events = [
    'Small Group Bible Study',
    'Spiritual Retreats', 
    'Monthly Fellowship Events for NNBA',
    'Holiday Events',
    'Workshops',
    'Game Night',
    'Family Reunions',
    'Seminars',
    'Festivals',
    'Revivals',
    'Business Teambuilding',
    'Small Group Exercise',
    'Anniversaries',
    'Church Cookout',
    'Bridal Showers',
    'Funeral Repass',
    'Baby Shower',
    'Community Events',
    'Birthday Parties'
  ]

  return (
    <JRGrahamLayout currentPage="home">
      {/* Hero Section */}
      <div className="relative text-white py-20 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video/Image_Animated_for_Website_B_roll.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Joseph R. Graham Center
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            3989 White Chapel Road, Lively, VA 22507
          </p>
          <p className="text-lg md:text-xl opacity-80 mb-10">
            Monthly Fellowship Events for NNBA
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Reserve Space Now
              </Button>
            </Link>
            <a 
              href="https://www.nnbaptist.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              nnbaptist.org
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/availability">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Availability</h3>
                  <p className="text-sm text-gray-600 mt-1">Check space availability</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/booking">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Space Rentals</h3>
                  <p className="text-sm text-gray-600 mt-1">Book your event space</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Contact</h3>
                  <p className="text-sm text-gray-600 mt-1">Get in touch with us</p>
                </CardContent>
              </Card>
            </Link>
            
            <a href="https://www.nnbaptist.org" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">NNBA</h3>
                  <p className="text-sm text-gray-600 mt-1">Northern Neck Baptist</p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </div>

      {/* Events & Activities Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Your Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Joseph R. Graham Center hosts a wide variety of events and activities 
              for the Northern Neck Baptist Association and the local community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{event}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/booking">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Book Your Event Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Contact Us for More Information
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready to book your event or have questions about our facilities? 
                We're here to help make your event a success.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-purple-600 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">3989 White Chapel Road, Lively, VA 22507</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-purple-600 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href="tel:804-462-9011" className="text-purple-600 hover:text-purple-700">
                      804-462-9011
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    Get in Touch
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Event Today</h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Booking</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Browse available spaces and book online instantly
                  </p>
                  <Link href="/booking">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      View Available Spaces
                    </Button>
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Check Availability</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    See what dates and times are available
                  </p>
                  <Link href="/availability">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600">
                      Check Calendar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </JRGrahamLayout>
  )
}
