import { useEffect, useRef, useState } from 'react';
import { useLazyGetCordinateQuery, useLazySearchLocationQuery } from '../features/googleLocation/Location';

const ShopLocationAutocomplete = ({ onSelect, value, onChange }) => {
  console.log("value", value)
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const componentRef = useRef(null);
  const timeoutRef = useRef(null);
  const autoSelectTimeoutRef = useRef(null);

  const [triggerSearch] = useLazySearchLocationQuery();
  const [triggerCoordinates] = useLazyGetCordinateQuery();

  const isValidCoordinate = (coord, type) => {
    if (type === 'lat') {
      return coord >= -90 && coord <= 90;
    } else if (type === 'lng') {
      return coord >= -180 && coord <= 180;
    }
    return false;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        // If user clicks outside and there are suggestions, auto-select the first one
        if (suggestions.length > 0 && !hasUserInteracted) {
          handleAutoSelectFirstSuggestion();
        } else {
          setSuggestions([]);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestions, hasUserInteracted]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoSelectTimeoutRef.current) {
        clearTimeout(autoSelectTimeoutRef.current);
      }
    };
  }, []);

  const handleAutoSelectFirstSuggestion = async () => {
    if (suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      await handleSuggestionSelection(firstSuggestion, true, value); // Pass current input value
    }
  };

  const fetchPlaces = async (inputValue) => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    setHasUserInteracted(false); // Reset interaction flag when new search starts

    try {
      console.log('bbbbbbbb')
      const { data } = await triggerSearch(inputValue);
      console.log(data)
      console.log("aaaaaaaa")
      if (data?.success && data?.data?.predictions) {
        setSuggestions(data.data.predictions);

        // Set up auto-select timeout for first suggestion
        if (autoSelectTimeoutRef.current) {
          clearTimeout(autoSelectTimeoutRef.current);
        }

        // Auto-select first suggestion after 3 seconds if no user interaction
        autoSelectTimeoutRef.current = setTimeout(() => {
          if (!hasUserInteracted && data.data.predictions.length > 0) {
            handleAutoSelectFirstSuggestion();
          }
        }, 2000); // Reduced to 2 seconds for better UX
      } else {
        setSuggestions([]);
        setError('No results found');
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (onChange) onChange(e);

    // Clear auto-select timeout when user continues typing
    if (autoSelectTimeoutRef.current) {
      clearTimeout(autoSelectTimeoutRef.current);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchPlaces(value);
    }, 300);
  };

  const handleSuggestionSelection = async (suggestion, isAutoSelected = false, userTypedText = null) => {
    setHasUserInteracted(!isAutoSelected); // Mark as user interaction only if not auto-selected

    // If auto-selected, keep the user's typed text; otherwise use suggestion description
    const displayText = isAutoSelected && userTypedText ? userTypedText : suggestion.description;

    if (onChange) {
      onChange({ target: { value: displayText } });
    }
    setSuggestions([]);
    setError(null);

    // Clear auto-select timeout since selection is happening
    if (autoSelectTimeoutRef.current) {
      clearTimeout(autoSelectTimeoutRef.current);
    }

    try {
      console.log('suggestion.place_id')
      const { data } = await triggerCoordinates(suggestion.place_id);
      console.log(suggestion.place_id)
      console.log(data)

      if (data?.success && data?.data) {
        const { lat, lng } = data.data;

        if (!isValidCoordinate(lat, 'lat') || !isValidCoordinate(lng, 'lng')) {
          setError('Invalid coordinates received from server');
          return;
        }

        if (onSelect) {
          onSelect({
            address: displayText, // Use the display text (user typed or suggestion)
            suggestedAddress: suggestion.description, // Also provide the actual suggestion
            coordinates: [lng, lat],
            isAutoSelected: isAutoSelected // Pass info about whether this was auto-selected
          });
        }
      } else {
        setError('Failed to get coordinates');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      setError('Failed to fetch coordinates');
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    await handleSuggestionSelection(suggestion, false);
  };

  const handleSuggestionHover = () => {
    setHasUserInteracted(true);
    // Clear auto-select timeout when user hovers over suggestions
    if (autoSelectTimeoutRef.current) {
      clearTimeout(autoSelectTimeoutRef.current);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionSelection(suggestions[0], false);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      if (autoSelectTimeoutRef.current) {
        clearTimeout(autoSelectTimeoutRef.current);
      }
    }
  };

  return (
    <div className="relative" ref={componentRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your shop location"
        style={{
          width: "100%",
          height: "44px",
          background: "transparent",
          border: `1px solid ${error ? 'red' : '#C68C4E'}`,
          outline: "none",
          fontSize: "14px",
          borderRadius: "10px",
          padding: "0 12px",
        }}
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={handleSuggestionHover}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 ${index === 0 ? 'bg-blue-50' : ''
                }`}
            >
              <div className="font-medium text-sm text-gray-800">
                {suggestion.structured_formatting?.main_text || suggestion.description}
                {index === 0 && (
                  <span className="text-xs text-blue-600 ml-2">(Auto-coordinates)</span>
                )}
              </div>
              {suggestion.structured_formatting?.secondary_text && (
                <div className="text-sm text-gray-600">
                  {suggestion.structured_formatting.secondary_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopLocationAutocomplete;