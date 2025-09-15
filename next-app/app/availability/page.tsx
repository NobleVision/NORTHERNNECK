'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import JRGrahamLayout from '@/components/JRGrahamLayout'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'

interface Space {
  id: string
  name: string
}

interface TimeSlot {
  time: string
  space: string
  status: 'available' | 'booked' | 'maintenance'
  capacity: number
  event?: string
}

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSpace, setSelectedSpace] = useState('all')
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)

  // Mock availability data - in real app this would come from API
  const mockAvailability: { date: string; timeSlots: TimeSlot[] }[] = [
    {
      date: '2024-09-15',
      timeSlots: [
        { time: '8:00 AM - 10:00 AM', space: 'Main Fellowship Hall', status: 'available', capacity: 60 },
        { time: '10:00 AM - 12:00 PM', space: 'Conference Room', status: 'booked', capacity: 35, event: 'Board Meeting' },
        { time: '12:00 PM - 2:00 PM', space: 'Small Meeting Room', status: 'available', capacity: 12 },
        { time: '2:00 PM - 4:00 PM', space: 'Outdoor Pavilion & Field', status: 'available', capacity: 150 },
        { time: '4:00 PM - 6:00 PM', space: 'Main Fellowship Hall', status: 'booked', capacity: 60, event: 'Youth Group' },
        { time: '6:00 PM - 8:00 PM', space: 'Conference Room', status: 'available', capacity: 35 },
      ]
    }
  ]

  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      const response = await fetch('/api/spaces')
      const data = await response.json()
      if (data.success) {
        setSpaces(data.data)
      }
    } catch (error) {
      console.error('Error fetching spaces:', error)
    } finally {
      setLoading(false)
    }
  }

  type SlotStatus = 'available' | 'booked' | 'maintenance'
  const getStatusColor = (status: SlotStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'booked':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: SlotStatus): JSX.Element | null => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />
      case 'booked':
        return <XCircle className="w-4 h-4" />
      case 'maintenance':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const filteredAvailability = mockAvailability[0]?.timeSlots.filter(slot => 
    selectedSpace === 'all' || slot.space === selectedSpace
  ) || []

  return (
    <JRGrahamLayout currentPage="availability">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Space Availability
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Check real-time availability for all our rental spaces
          </p>
          <div className="flex items-center justify-center text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            <span>3989 White Chapel Road, Lively, VA 22507</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Space
                </label>
                <select
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Spaces</option>
                  {spaces.map((space) => (
                    <option key={space.id} value={space.name}>
                      {space.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {filteredAvailability.filter(slot => slot.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available Slots</div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {filteredAvailability.filter(slot => slot.status === 'booked').length}
              </div>
              <div className="text-sm text-gray-600">Booked Slots</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{spaces.length}</div>
              <div className="text-sm text-gray-600">Total Spaces</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm text-gray-600">Selected Day</div>
            </CardContent>
          </Card>
        </div>

        {/* Availability Grid */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Availability for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {filteredAvailability.length} Time Slots
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAvailability.length > 0 ? (
                <div className="space-y-4">
                  {filteredAvailability.map((slot, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="font-medium text-gray-900">{slot.time}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="text-gray-700">{slot.space}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-gray-500 mr-2" />
                          <span className="text-gray-700">{slot.capacity} capacity</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {slot.event && (
                          <span className="text-sm text-gray-600 italic">
                            {slot.event}
                          </span>
                        )}
                        
                        <Badge className={`${getStatusColor(slot.status)} flex items-center gap-1`}>
                          {getStatusIcon(slot.status)}
                          {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                        </Badge>
                        
                        {slot.status === 'available' && (
                          <Link href="/booking">
                            <Button size="sm" variant="default" className="bg-purple-600 hover:bg-purple-700">
                              Book Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No availability data</h3>
                  <p className="text-gray-600 mb-6">
                    No availability information found for the selected date and filters.
                  </p>
                  <Link href="/booking">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      View All Spaces
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Badge className="bg-green-100 text-green-800 border-green-200 mr-3">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Available
                </Badge>
                <span className="text-gray-600">Space is available for booking</span>
              </div>
              
              <div className="flex items-center">
                <Badge className="bg-red-100 text-red-800 border-red-200 mr-3">
                  <XCircle className="w-4 h-4 mr-1" />
                  Booked
                </Badge>
                <span className="text-gray-600">Space is already reserved</span>
              </div>
              
              <div className="flex items-center">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 mr-3">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Maintenance
                </Badge>
                <span className="text-gray-600">Space is under maintenance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Book Your Space?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Found an available time slot that works for your event? 
            Book now to secure your preferred space and time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" variant="default" className="bg-purple-600 hover:bg-purple-700">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Event
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Have Questions?
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </JRGrahamLayout>
  )
}
