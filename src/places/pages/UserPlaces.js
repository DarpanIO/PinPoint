import React from 'react'
import PlaceList from '../components/PlaceList'
import { useParams } from 'react-router-dom'

const DUMMY_PLACES=[
    {
        id:'p1',
        title:'Empire State Building',
        description:'One of the most famous sky scrapers in the world!',
        imageUrl:'https://i.ytimg.com/vi/iRV-XdwRkO4/mqdefault.jpg',
        address:'20W34th St,New York,NY 10001',
        location:{
         lat:40.7484405,
         lng:-73.9878584
       },
        creator:'u1'
    },
    {
        id:'p2',
        title:'Empire State Building',
        description:'One of the most famous sky scrapers in the world!',
        imageUrl:'https://i.ytimg.com/vi/iRV-XdwRkO4/mqdefault.jpg',
        address:'20W34th St,New York,NY 10001',
        location:{
         lat:40.7484405,
         lng:-73.9878584
       },
        creator:'u2'
    }
]
export default function UserPlaces() {
    const userId=useParams().userId;
    const loadedPlaces= DUMMY_PLACES.filter(place => place.creator===userId);
  return (
    <PlaceList items={loadedPlaces}/>

  )
}
