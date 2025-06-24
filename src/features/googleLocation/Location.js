import { baseApi } from "../../apiBaseQuery";

export const LocationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchLocation: builder.query({
      query: (search) => ({
        url: `/home/auto-complete?input=${encodeURIComponent(search)}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        try {
          if (response?.data?.predictions) {
            return {
              success: true,
              data: {
                predictions: response.data.predictions.map(prediction => ({
                  ...prediction,
                  description: prediction.description,
                  place_id: prediction.place_id,
                  structured_formatting: prediction.structured_formatting
                }))
              }
            };
          }
          return {
            success: false,
            data: {
              predictions: []
            },
            message: response?.message || 'No predictions found'
          };
        } catch (error) {
          console.error('Error transforming search response:', error);
          return {
            success: false,
            data: {
              predictions: []
            },
            message: 'Error processing search results'
          };
        }
      },
      transformErrorResponse: (response) => {
        return {
          success: false,
          message: response?.data?.message || 'Failed to search locations',
          status: response?.status
        };
      }
    }),

    getCordinate: builder.query({
      query: (place_id) => ({
        url: `/home/get-coordinates?placeId=${encodeURIComponent(place_id)}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        try {
          if (response?.data?.lat && response?.data?.lng) {
            const lat = parseFloat(response.data.lat);
            const lng = parseFloat(response.data.lng);

            // Validate coordinates
            if (isNaN(lat) || isNaN(lng)) {
              return {
                success: false,
                message: 'Invalid coordinate format received'
              };
            }

            // Check coordinate bounds
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
              return {
                success: false,
                message: 'Coordinates out of valid range'
              };
            }

            return {
              success: true,
              data: {
                lat: lat,
                lng: lng
              }
            };
          }
          return {
            success: false,
            message: response?.message || 'Coordinates not found in response'
          };
        } catch (error) {
          console.error('Error transforming coordinate response:', error);
          return {
            success: false,
            message: 'Error processing coordinate data'
          };
        }
      },
      transformErrorResponse: (response) => {
        return {
          success: false,
          message: response?.data?.message || 'Failed to get coordinates',
          status: response?.status
        };
      }
    }),
  }),
});

export const {
  useLazySearchLocationQuery,
  useLazyGetCordinateQuery
} = LocationApi;