import axios from 'axios'

const $axios = axios.create({
  baseURL: 'https://select.pdgzf.com/api/v1.0',
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default $axios
