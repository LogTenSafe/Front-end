import { LocaleMessageObject } from 'vue-i18n'

const password = 'password'
const emailAddress = 'email address'

const en: LocaleMessageObject = {
  backup: {
    uploadedFrom: 'Uploaded from {0}',
    lastFlight: '{date} ({hours})',
    download: '{link} ({size})',
    downloadLink: 'Download',
    deleteLink: 'Delete',
    flight: '{0} → {1}',
    deleteFailed: 'Couldn’t delete that backup.'
  },
  backups: {
    columns: {
      date: 'Date ▼',
      totalHours: 'Total Hours',
      lastFlight: 'Last Flight'
    },
    title: 'My Backups',
    loading: 'Loading…',
    none: {
      lead: 'You’re ready to start backing up your logbook.'
    },
    error: {
      lead: 'Sorry, but there was an error loading your backups.',
      description: 'Don’t worry though; your backups are safe. I’ve been notified of the error so I can fix it. You can try again later.',
      details: 'The error was: {0}'
    }
  },
  downloadClient: {
    description: 'Download the {clientLink} to your computer and run it. It will back up your logbook automatically. Remember that LogTenSafe only works with the macOS version of LogTen Pro.',
    clientLink: 'macOS client',
    clientImageAlt: 'Back Up Now button on client',
    manualUpload: 'You can also {uploadLink}. When the file picker opens, press {keyboardCombo} and paste in {path}, then press {button}. Upload the {file} file.',
    uploadLink: 'upload a LogTenCoreDataStore.sql file manually',
    uploadingModal: {
      title: 'Add Backup',
      contents: 'Uploading your backup…',
      failed: 'Couldn’t upload that backup.',
      complete: 'Your backup has been created.'
    }
  },
  home: {
    jumbotron: {
      header: 'Keep your logbook safe.',
      lead: 'LogTenSafe provides automatic, regular backups of your LogTen Pro logbook. If iCloud unexpectedly corrupts your logbook, you can go back in time and restore from a backup. Backing up is automatic and transparent.'
    },
    getStartedButton: 'Get Started »',
    alreadyHaveAccount: 'Already have an account?',
    loginForm: {
      email: emailAddress,
      password,
      rememberMe: 'Remember me',
      submit: 'Log In',
      forgotPassword: 'I forgot my password :('
    }
  },
  footer: {
    copyright: '© 2014 Tim Morgan. Released under the MIT license.',
    contribute: 'This is an open-source project. You can make it better.'
  },
  signup: {
    header: 'Get started by signing up below.',
    email: emailAddress,
    password,
    passwordConfirmation: 'again',
    submit: 'Sign Up',
    haveAccount: 'I already have an account.'
  },
  filters: {
    duration: '{0} hr',
    unknownAirport: '???'
  },
  restoreInstructions: {
    title: 'Your logbook is downloading.',
    description1: 'To restore your logbook manually in macOS, open the Go To Folder in Finder by choosing the {goToMenuItem} menu item, or pressing {goToShortcut}. Paste {path} into the text field and press {goButton}.',
    description2: 'Drag the {filename} file you just downloaded into this {data} folder, replacing the existing file.',
    goToMenuItem: 'Go ▶ Go to Folder…',
    goToShortcut: 'Command-Shift-G',
    goButton: 'Go',
    goWindowAlt: 'Go to Folder window'
  },
  navbar: {
    addBackup: 'Add Backup',
    downloadClient: 'Download Client',
    logOut: 'Log Out'
  },
  mustBeLoggedIn: 'You must log in to your account first.',
  mustBeLoggedOut: 'You must log out of your account first.',
  forgotPassword: {
    title: 'Forgot your password?',
    text: 'That’s OK. Give me your email address and I’ll email you a link you can use to reset your'
      + ' password.',
    placeholder: 'email address',
    submitButton: 'Send Email',
    success: 'Password reset email sent. Check your inbox!'
  },
  resetPassword: {
    title: 'Reset your password',
    successMessage: 'Your password has been reset. Please log in again.',
    badToken: 'The Reset Password link you used is invalid or expired.',
    button: 'Change Password'
  },
  error: {
    title: 'Sorry, an error occurred.'
  },
  changePassword: {
    title: 'Change your account password',
    currentPasswordPlaceholder: 'current password',
    newPasswordPlaceholder: 'new password',
    confirmationPlaceholder: 'again',
    button: 'Change Password',
    success: 'Your account password has been updated.'
  },
  deleteAccount: {
    button: 'Delete My Account',
    title: 'Delete your account',
    confirm: 'Are you sure you want to delete your account and all your backups?',
    confirmOK: 'Delete Account'
  },
  notFound: {
    header: 'Not Found',
    message: 'Sorry, but you navigated somewhere that either never existed, or doesn’t exist anymore.'
  }
}
export default en
