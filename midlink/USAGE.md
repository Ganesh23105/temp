# MedLink - Local Usage Guide

This application now works completely offline without any external database requirements. All data is stored in your browser's sessionStorage for the duration of your browser session.

## How It Works

- **Data Storage**: Uses browser sessionStorage (persists only during the browser session)
- **File Storage**: PDF and image files are stored as base64 encoded strings in memory
- **Authentication**: Simple username/password authentication stored locally

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`

## Using the Application

### Step 1: Register an Account

1. Click on "Register" tab
2. Enter a username (e.g., "patient1")
3. Enter a password
4. Confirm password
5. Select role: **Patient** or **Doctor**
6. Click "Create Account"

### Step 2: Login

1. Enter your username in the Email field
2. Enter your password
3. Select the same role you registered with
4. Click "Login"

### For Patients

**Profile Tab**:
- View your profile information
- See total reports and shared reports count

**Report Tab**:
- Upload medical reports (PDF, JPG, JPEG, PNG)
- View all uploaded reports
- Share reports with doctors by entering a doctor's email/username
- Track report status (Uploaded/Shared)

### For Doctors

**Patients Tab**:
- View all reports shared by patients
- Click "Review" to provide diagnosis/feedback
- Submit feedback for patient reports

**Diagnosis History Tab**:
- View all previous diagnoses you've submitted
- See patient names, report names, dates, and your feedback

## Data Flow Example

1. **Patient registers and logs in** → Creates account stored in sessionStorage
2. **Patient uploads a PDF report** → File converted to base64 and stored in sessionStorage
3. **Patient shares report with doctor** → Report marked as "Shared" and added to shared reports list
4. **Doctor logs in** → Sees all shared reports from patients
5. **Doctor reviews and provides feedback** → Feedback stored and visible in doctor's diagnosis history

## Important Notes

- **Data Persistence**: Data persists only during your browser session. If you close the browser or refresh the page, all data will be lost.
- **Multiple Sessions**: You can test the application by opening multiple browser windows or tabs to simulate different users.
- **File Size**: Large PDF files may slow down the application since they're stored in memory.
- **No Server Required**: The application runs entirely in your browser without needing any backend server or database.

## Testing the Full Workflow

1. Register a patient account (e.g., username: "john", role: patient)
2. Login as the patient
3. Upload a sample PDF report
4. Share it with a doctor (e.g., enter "dr.smith@email.com")
5. Logout
6. Register a doctor account (e.g., username: "dr.smith", role: doctor)
7. Login as the doctor
8. View the shared report in the "Patients" tab
9. Click "Review" and submit feedback
10. Check the "Diagnosis History" tab to see your feedback

## Build for Production

To create a production build:

```bash
npm run build
```

The optimized build will be created in the `build/` folder and can be served with any static file server.
