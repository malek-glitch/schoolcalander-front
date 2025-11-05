import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';


const localizer = momentLocalizer(moment);

// Données temporaires pour tester
const temporaryEvents = [
  {
    id: 1,
    title: 'Mathématiques - A101',
    start: new Date(2024, 0, 15, 8, 0),
    end: new Date(2024, 0, 15, 10, 0),
    resource: { type: 'COURS', teacher: 'Prof. Dupont' }
  },
  {
    id: 2,
    title: 'Physique - B205',
    start: new Date(2024, 0, 15, 10, 30),
    end: new Date(2024, 0, 15, 12, 30),
    resource: { type: 'TD', teacher: 'Prof. Martin' }
  },
  {
    id: 3,
    title: 'Informatique - C301',
    start: new Date(2024, 0, 16, 14, 0),
    end: new Date(2024, 0, 16, 16, 0),
    resource: { type: 'TP', teacher: 'Prof. Lambert' }
  }
];

export default function StudentCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Pour l'instant, on utilise les données temporaires
      // Plus tard, on utilisera l'API :
      // const response = await api.get('/events');
      // const mappedEvents = response.data.map(event => ({ ... }));
      
      setEvents(temporaryEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      // En cas d'erreur, on utilise les données temporaires
      setEvents(temporaryEvents);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    
    if (event.resource?.type === 'TD') {
      backgroundColor = '#28a745';
    } else if (event.resource?.type === 'TP') {
      backgroundColor = '#dc3545';
    } else if (event.resource?.type === 'EXAM') {
      backgroundColor = '#ffc107';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Suivant",
          previous: "Précédent",
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Événement",
          noEventsInRange: "Aucun cours dans cette période"
        }}
        defaultView="week"
        min={new Date(2024, 0, 1, 7, 0)}
        max={new Date(2024, 0, 1, 20, 0)}
      />
    </div>
  );
}