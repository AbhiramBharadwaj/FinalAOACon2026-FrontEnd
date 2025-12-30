import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  registration: null,
  accommodationBookings: [],
  abstract: null,
  feedback: null,
  stepperProgress: {
    registration: false,
    accommodation: false,
    conferenceDays: false,
    abstractUpload: false,
    feedback: false
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_REGISTRATION':
      return {
        ...state,
        registration: action.payload,
        stepperProgress: {
          ...state.stepperProgress,
          registration: action.payload?.paymentStatus === 'PAID'
        }
      };
    case 'SET_ACCOMMODATION_BOOKINGS':
      return {
        ...state,
        accommodationBookings: action.payload,
        stepperProgress: {
          ...state.stepperProgress,
          accommodation: action.payload?.some(booking => booking.paymentStatus === 'PAID')
        }
      };
    case 'SET_ABSTRACT':
      return {
        ...state,
        abstract: action.payload,
        stepperProgress: {
          ...state.stepperProgress,
          abstractUpload: !!action.payload
        }
      };
    case 'SET_FEEDBACK':
      return {
        ...state,
        feedback: action.payload,
        stepperProgress: {
          ...state.stepperProgress,
          feedback: !!action.payload
        }
      };
    case 'UPDATE_STEPPER_PROGRESS':
      return {
        ...state,
        stepperProgress: {
          ...state.stepperProgress,
          [action.payload.step]: action.payload.completed
        }
      };
    case 'RESET_APP_STATE':
      return initialState;
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setRegistration = (registration) => {
    dispatch({ type: 'SET_REGISTRATION', payload: registration });
  };

  const setAccommodationBookings = (bookings) => {
    dispatch({ type: 'SET_ACCOMMODATION_BOOKINGS', payload: bookings });
  };

  const setAbstract = (abstract) => {
    dispatch({ type: 'SET_ABSTRACT', payload: abstract });
  };

  const setFeedback = (feedback) => {
    dispatch({ type: 'SET_FEEDBACK', payload: feedback });
  };

  const updateStepperProgress = (step, completed) => {
    dispatch({ 
      type: 'UPDATE_STEPPER_PROGRESS', 
      payload: { step, completed } 
    });
  };

  const resetAppState = () => {
    dispatch({ type: 'RESET_APP_STATE' });
  };

  const value = {
    ...state,
    setRegistration,
    setAccommodationBookings,
    setAbstract,
    setFeedback,
    updateStepperProgress,
    resetAppState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};