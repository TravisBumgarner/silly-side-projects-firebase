import axios from 'axios'
import * as admin from 'firebase-admin'
import { config, https } from 'firebase-functions'

const cors = require('cors')({ origin: true })

admin.initializeApp()

type Submission = {
  email: string
  name: string
  message: string
  timestamp: Date

}

const prettyPrintSubmission = (submission: Submission) => {
  return `
    Name: ${submission.name}
    Email: ${submission.email}
    Message: ${submission.message}
    Timestamp: ${submission.timestamp}
  `
}

export const contactForm = https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { email, name, message, website } = req.body.data

      const submission = {
        email,
        name,
        message,
        timestamp: new Date()
      }

      const result = await admin
        .firestore()
        .collection('contact_form')
        .add(submission)

      const postData = {
        token: config().pushover.app_token,
        user: config().pushover.user_token,
        // device: config().pushover.device, // Push to all devices.
        title: `Form Submission: ${website}`,
        message: prettyPrintSubmission(submission)
      }

      axios
        .post('https://api.pushover.net/1/messages.json', postData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          console.log('Response:', response.data)
        })
        .catch(error => {
          console.error('Error:', error.message)
        })

      res.send({
        status: 200,
        data: result.id
      })

      return
    } catch (error) {
      console.error('Error submitting form:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })
})
