import { combineReducers, configureStore } from '@reduxjs/toolkit'
import * as User from './reducers/userReducers'
import * as Class from './reducers/classReducers'
import * as Grade from './reducers/gradeReducers'

import * as Auth from './reducers/authReducers'

import { moreIconReducer } from './reducers/moreIconReducers'

const rootReducer = combineReducers({
  // User reducer
  userLogin: Auth.userLoginReducer,
  userRegister: Auth.userRegisterReducer,
  userChangePassword: User.userChangePasswordReducer,
  userGetProfile: User.userGetProfileReducer,
  userUpdateProfile: User.userUpdateProfileReducer,
  adminGetAllUsers: User.adminGetAllUsersReducer,
  adminDeleteUser: User.adminDeleteUserReducer,
  adminEditUser: User.adminEditUserReducer,

  //Class reducer
  userGetAllStudents: Class.userGetAllStudentsReducer,
  userGetAllTeachers: Class.userGetAllTeachersReducer,
  adminGetAllClasses: Class.adminGetAllClassesReducer,
  adminDeleteClass: Class.adminDeleteClassReducer,
  adminUpdateClass: Class.adminUpdateClassReducer,
  userGetAllMyClasses: Class.userGetAllMyClassesReducer,
  userCreateNewClass: Class.userCreateNewClassReducer,
  userGetClassByID: Class.userGetClassByIDReducer,
  userJoinClassByCode: Class.userJoinClassByCodeReducer,
  userSendInvitationByEmail: Class.userSendInvitationoByEmailReducer,
  userGetAllTypeOfStudents: Class.userGetAllTypeOfStudentsReducer,

  // Grade reducer
  userGetAllGradeCompositionByClassId: Grade.userGetAllGradeCompositionByClassIdReducer,
  userGetAllReviewGradeCompositionByStudentId: Grade.userGetAllReviewGradeCompositionByStudentIdReducer,

  isOpenMenu: moreIconReducer

})

// Get userInfo from localStorage
const userInfoFormStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

// initialState
const initialState = {
  userLogin: { userInfo: userInfoFormStorage }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState
})