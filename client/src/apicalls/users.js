const { axiosInstance } = require(".");

export const LoginUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/login", payload);
  return response;
};

export const RegisterUser = async (payload) => {
  const response = await axiosInstance("post", "/api/users/register", payload);
  return response;
};

export const GetCurrentUser = async () => {
  const response = await axiosInstance("get", "/api/users/get-current-user");
  return response;
};

export const GetAllDonorsOfAnOrganisation = () => {
  return axiosInstance("get", "/api/users/get-all-donors");
};

export const GetAllHospitalsOfAnOrganisation = () => {
  return axiosInstance("get", "/api/users/get-all-hospitals");
};

export const GetAllOrganisationsofADonor = () => {
  return axiosInstance("get", "/api/users/get-all-organisations-of-a-donor");
};

export const GetAllOrganisationsofAHospital = () => {
  return axiosInstance("get", "/api/users/get-all-organisations-of-a-hospital");
};
