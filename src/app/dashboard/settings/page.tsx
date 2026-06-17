"use client";

import { UserType, useUserStore } from "@/store/user";
import { notify } from "@/utils/toast";
import {
  Button,
  Divider,
  Flex,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { MdLock, MdVerifiedUser } from "react-icons/md";
import { ToastContainer } from "react-toastify";

function page() {
  const {
    isLoading,
    error,
    clearError,
    updatePassword,
    currentUser,
    updateUser,
  } = useUserStore();
  const { firstname, lastname, email, role } = currentUser as UserType;
  const [settingsNav, setSettingsNav] = useState("user");
  const [formPasswordData, setformPasswordData] = useState({
    newpassword: "",
    confirmpassword: "",
  });

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const [formUserInfoData, setUserInfoData] = useState({
    firstname: firstname,
    lastname: lastname,
    role: role,
    email: email,
  });

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  }>();
  const [formUserErrors, setUserFormErrors] = useState<{
    email?: string;
  }>();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformPasswordData((prev) => ({ ...prev, [name]: value }));
    if (formErrors && formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) clearError();
  };
  // handle user change
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfoData((prev) => ({ ...prev, [name]: value }));
    if (formErrors && formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) clearError();
  };

  const validatePassword = () => {
    const errs: typeof formErrors = {};
    if (!formPasswordData.newpassword) errs.password = "Passowrd Required";
    else if (formPasswordData.newpassword.length < 6)
      errs.password = "Min 6 Characters";
    else if (!/[A-Z]/.test(formPasswordData.newpassword))
      errs.password = "Must contain at least one uppercase letter";
    else if (!/[0-9]/.test(formPasswordData.newpassword))
      errs.password = "Must contain at least one number";
    else if (!/[!@#$%^&*]/.test(formPasswordData.newpassword))
      errs.password = "Must contain at least one special character";
    if (!formPasswordData.confirmpassword)
      errs.passwordConfirmation = "please confirm your password";
    else if (formPasswordData.newpassword !== formPasswordData.confirmpassword)
      errs.passwordConfirmation = `Passwords don't match`;
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  // validate email

  const validateEmail = () => {
    const errs: typeof formErrors = {};
    if (!formUserInfoData.email) errs.email = "Email Required";
    else if (!/\S+@\S+\.\S+/.test(formUserInfoData.email))
      errs.email = "Invalid Email";

    setUserFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePassswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;
    const success = await updatePassword(
      currentUser?.email as string,
      formPasswordData.newpassword,
    );
    if (success) {
      notify.success("Password updated successfully!");
    }
  };

  // handle userinfo update
  const handleUserdUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;
    const success = await updateUser(
      currentUser?.email as string,
      formUserInfoData.firstname,
      formUserInfoData.lastname,
      formUserInfoData.role as string,
      formUserInfoData.email,
    );
    if (success) {
      notify.success("User information updated successfully!");
    }
  };

  return (
    <Flex
      direction={"column"}
      gap={24}
      className="sticky top-0 p-6 z-30 bg-white rounded-3xl  overflow-y-auto"
    >
      <Flex justify={"space-between"}>
        <h1 className="text-2xl font-semibold ">Settings</h1>
      </Flex>

      <Flex gap={20}>
        <Button
          value={"user"}
          onClick={() => setSettingsNav("user")}
          variant={settingsNav === "user" ? "filled" : "outline"}
          leftSection={<MdVerifiedUser />}
        >
          <span className="font-medium!">User Info</span>
        </Button>
        <Button
          onClick={() => setSettingsNav("password")}
          value={"password"}
          variant={settingsNav === "password" ? "filled" : "outline"}
          leftSection={<MdLock />}
        >
          <span className="font-medium!">Password</span>
        </Button>
      </Flex>
      <Divider />
      {settingsNav === "password" && (
        <>
          <Flex gap={72} direction="column" align="center">
            <form onSubmit={handlePassswordUpdate} noValidate>
              <Flex
                direction="column"
                gap={16}
                className="bg-background rounded-3xl"
                p={32}
              >
                <PasswordInput
                  label="Current Password"
                  readOnly
                  value={currentUser?.password}
                  styles={{
                    label: {
                      fontWeight: 500,
                      fontSize: "14px",
                      marginBottom: "8px",
                    },
                  }}
                />
                <PasswordInput
                  styles={{
                    label: {
                      fontWeight: 500,
                      fontSize: "14px",
                      marginBottom: "8px",
                    },
                  }}
                  type="password"
                  withAsterisk
                  label="Password"
                  name="newpassword"
                  error={formErrors?.password}
                  onChange={handlePasswordChange}
                  size="md"
                  labelProps={{ className: "mb-2" }}
                  w="500px"
                  placeholder="Enter Your Password"
                />
                <PasswordInput
                  styles={{
                    label: {
                      fontWeight: 500,
                      fontSize: "14px",
                      marginBottom: "8px",
                    },
                  }}
                  type="password"
                  width={"100%"}
                  withAsterisk
                  label="Password Confirmation"
                  name="confirmpassword"
                  error={formErrors?.passwordConfirmation}
                  onChange={handlePasswordChange}
                  size="md"
                  labelProps={{ className: "mb-2" }}
                  w="500px"
                  placeholder="Enter Your Password"
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button
                  loading={isLoading}
                  loaderProps={{ type: "dots" }}
                  disabled={isLoading}
                  type="submit"
                  color="primary"
                  size="md"
                  className="transition-all hover:opacity-90 font-medium!"
                  mt={20}
                >
                  Save Changes
                </Button>
              </Flex>
            </form>
          </Flex>
        </>
      )}
      {settingsNav === "user" && (
        <>
          <Flex gap={72} direction="column" align="center">
            <form onSubmit={handleUserdUpdate} noValidate>
              <Flex
                direction="column"
                gap={16}
                className="bg-background rounded-3xl"
                p={32}
                w="500px"
              >
                <Flex gap={16}>
                  <TextInput
                    styles={{
                      label: {
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "8px",
                      },
                    }}
                    value={formUserInfoData?.firstname}
                    type="text"
                    label="First name"
                    withAsterisk
                    name="firstname"
                    onChange={handleUserChange}
                    labelProps={{ className: "mb-2" }}
                    size="md"
                    placeholder="ex: andy"
                  />

                  <TextInput
                    styles={{
                      label: {
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "8px",
                      },
                    }}
                    type="text"
                    label="Last name"
                    value={formUserInfoData?.lastname}
                    withAsterisk
                    name="lastname"
                    onChange={handleUserChange}
                    labelProps={{ className: "mb-2" }}
                    size="md"
                    placeholder="ex: martin"
                  />
                </Flex>
                <Select
                  withAsterisk
                  styles={{
                    label: {
                      fontWeight: 500,
                      fontSize: "14px",
                      marginBottom: "8px",
                    },
                  }}
                  searchable
                  value={formUserInfoData.role}
                  label="Role"
                  name="role"
                  placeholder={"ex: developer"}
                  size="md"
                  onChange={(value) =>
                    setUserInfoData((prev) => ({ ...prev, role: value ?? "" }))
                  }
                  data={[
                    { label: "Developer", value: "Developer" },
                    { label: "Designer", value: "Designer" },
                    { label: "Manager", value: "Manager" },
                    { label: "Tester", value: "Tester" },
                  ]}
                />
                <TextInput
                  styles={{
                    label: {
                      fontWeight: 500,
                      fontSize: "14px",
                      marginBottom: "8px",
                    },
                  }}
                  type="email"
                  label="Email"
                  withAsterisk
                  value={formUserInfoData?.email}
                  error={formErrors?.email}
                  name="email"
                  onChange={handleUserChange}
                  rightSection={
                    <CiMail
                      size={20}
                      color={formErrors?.email ? "red" : "#121212"}
                      className="stroke-[0.5]"
                    />
                  }
                  labelProps={{ className: "mb-2" }}
                  w="100%"
                  size="md"
                  placeholder="Enter Your Email"
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button
                  loading={isLoading}
                  loaderProps={{ type: "dots" }}
                  disabled={isLoading}
                  type="submit"
                  color="primary"
                  size="md"
                  className="transition-all hover:opacity-90 font-medium!"
                  mt={20}
                >
                  Save Changes
                </Button>
              </Flex>
            </form>
          </Flex>
        </>
      )}
      <ToastContainer />
    </Flex>
  );
}

export default page;
