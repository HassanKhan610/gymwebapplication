import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
        query: (user) => {
            return{
                url: 'register/',
                method: 'POST',
                body: user,
                headers: {
                    'content-type': 'application/json',
                }
            }
        }
    }),
    loginUser: builder.mutation({
      query: (user) => {
          return{
              url: 'login/',
              method: 'POST',
              body: user,
              headers: {
                  'content-type': 'application/json',
              }
          }
      }
    }),
    getLoggedUser: builder.query({
        query: (access_token) => {
            return{
                url: 'profile/',
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${access_token}`,
                }
            }
        }
    }),
    changeUserPassword: builder.mutation({
        query: ({actualData, access_token}) => {
            return{
                url: 'changepassword/',
                method: 'POST',
                body: actualData,
                headers: {
                    'authorization': `Bearer ${access_token}`,
                }
            }
        }
    }),
    sendPasswordResetEmail: builder.mutation({
        query: (user) => {
            return{
                url: 'send-reset-password-email/',
                method: 'POST',
                body: user,
                headers: {
                    'content-type': `application/json`,
                }
            }
        }
    }),
    resetPassword: builder.mutation({
        query: ({actualData, id, token}) => {
            return{
                url: `/reset-password/${id}/${token}/`,
                method: 'POST',
                body: actualData,
                headers: {
                    'content-type': `application/json`,
                }
            }
        }
    }),
  }),
})

export const { useRegisterUserMutation, 
                useLoginUserMutation, 
                useGetLoggedUserQuery, useChangeUserPasswordMutation, 
                useSendPasswordResetEmailMutation, useResetPasswordMutation 
            } = userAuthApi


export const trainersApi = createApi({
  reducerPath: 'trainersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }), // Replace with the correct URL for fetching trainers
  endpoints: (builder) => ({
    getTrainers: builder.query({
      query: () => 'all-trainers/', // Replace with the correct endpoint to fetch the list of trainers
    }),
    createTrainerProfile: builder.mutation({
        query: ({ actualData, access_token }) => {
          return {
            url: 'create-trainer-profile/', // Adjust the URL as per your backend route for creating trainer profiles
            method: 'POST',
            body: actualData,
            headers: {
              'authorization': `Bearer ${access_token}`,
              
            },
          };
        },
    }),
    updateTrainerProfile: builder.mutation({
        query: ({ trainerId, actualData, access_token }) => {
          return {
            url: `update-trainer-profile/`, 
            method: 'PUT',
            body: actualData,
            headers: {
              'authorization': `Bearer ${access_token}`,
             
            },
          };
        },
      }),
  }),
});
export const { useGetTrainersQuery, useCreateTrainerProfileMutation, useUpdateTrainerProfileMutation } = trainersApi;


export const productsApi = createApi({
    // reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
    endpoints: (builder) => ({
      getProducts: builder.query({
        query: () => 'products/',
      }),
    //   createProduct: builder.mutation({
    //     query: (product) => ({
    //       url: 'products/',
    //       method: 'POST',
    //       body: product,
    //     }),
    //   }),
    //   updateProduct: builder.mutation({
    //     query: ({ productId, product }) => ({
    //       url: `products/${productId}/`,
    //       method: 'PUT',
    //       body: product,
    //     }),
    //   }),
    // createOrder: builder.mutation({
    //   query: (order) => ({
    //     url: 'create-order/', // Adjust the URL as needed
    //     method: 'POST',
    //     body: order,
    //   }),
    // }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'create-order/',
        method: 'POST',
        body: orderData,
      }),
    }),
    }),
  });
  
  export const { useGetProductsQuery, useCreateOrderMutation  } = productsApi;


  export const subscriptionApi = createApi({
    reducerPath: 'gymApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/user/' }),
    endpoints: (builder) => ({
      createSubscription: builder.mutation({
        query: (subscription) => ({
          url: 'subscriptions/',
          method: 'POST',
          body: subscription,
        }),
      }),
      getSubscriptionDetails: builder.query({
        query: (access_token) => {
          return{
              url: 'subscriptions/details/',
              method: 'GET',
              headers: {
                  'authorization': `Bearer ${access_token}`,
              }
          }
      }
      }),
      initiateStripePayment: builder.mutation({
        query: (subscriptionId) => ({
            url: `subscriptions/${subscriptionId}/create-checkout-session/`,
            method: 'POST',
        }),
    }),
    }),
  });
  
  export const { useCreateSubscriptionMutation, useGetSubscriptionDetailsQuery, useInitiateStripePaymentMutation  } = subscriptionApi;