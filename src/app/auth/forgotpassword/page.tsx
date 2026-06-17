"use client";
import { useUserStore } from "@/store/user";
import { Button, Flex, GridCol, PasswordInput, TextInput } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { Bounce, ToastContainer, Zoom, toast } from "react-toastify";
import { CiLock, CiMail } from "react-icons/ci";
import { notify } from "@/utils/toast";
import Link from "next/link";
import { text } from "stream/consumers";

function ForgotPassword() {
  const {
    isLoading,
    error,
    clearError,
    users,
    updatePassword,
    saveNewPassword,
  } = useUserStore();

  const [formData, setFormData] = useState({
    email: "",
    newpassword: "",
    confirmpassword: "",
  });

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors && formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) clearError();
  };

  const validate = () => {
    const existingUser = users.find((user) => user.email === formData.email);
    const errs: typeof formErrors = {};
    if (!existingUser) errs.email = "User Not Found";
    if (!formData.email) errs.email = "Email Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid Email";
    if (!formData.newpassword) errs.password = "Passowrd Required";
    else if (formData.newpassword.length < 6)
      errs.password = "Min 6 Characters";
    else if (!/[A-Z]/.test(formData.newpassword))
      errs.password = "Must contain at least one uppercase letter";
    else if (!/[0-9]/.test(formData.newpassword))
      errs.password = "Must contain at least one number";
    else if (!/[!@#$%^&*]/.test(formData.newpassword))
      errs.password = "Must contain at least one special character";
    if (!formData.confirmpassword)
      errs.passwordConfirmation = "please confirm your password";
    else if (formData.newpassword !== formData.confirmpassword)
      errs.passwordConfirmation = `Passwords don't match`;
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    const success = await updatePassword(formData.email, formData.newpassword);
    if (success) {
      notify.success("Password updated successfully!");
    }
  };

  return (
    <GridCol
      span={6}
      className="bg-white flex justify-center pt-8 h-[calc(100vh-48px)] rounded-2xl"
    >
      {/* <ToastContainer /> */}
      <Flex
        gap={72}
        direction="column"
        className="w-[calc(100%-160px)]"
        align="center"
      >
        <Image width={167} height={75} src="/logo.png" unoptimized alt="Logo" />
        <Flex direction="column" align="center" justify="center" gap={40}>
          <Flex direction="column" align="center" justify="center" gap={4}>
            <h1 className="text-3xl">Setup Password</h1>
            <p>Please add a new password for the next login.</p>
          </Flex>
          <form onSubmit={handleSubmit} noValidate>
            <Flex direction="column" gap={16}>
              <TextInput
                styles={{
                  label: {
                    fontWeight: 500,
                    fontSize: "14px",
                    marginBottom: "8px",
                  },
                }}
                withAsterisk
                type="email"
                label="Email"
                error={formErrors?.email}
                name="email"
                onChange={handleChange}
                rightSection={
                  <CiMail
                    className="stroke-[0.5]"
                    size={20}
                    color={formErrors?.email ? "red" : "#121212"}
                  />
                }
                labelProps={{ className: "mb-2" }}
                w="500px"
                size="md"
                placeholder="Enter Your Email"
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
                onChange={handleChange}
                size="md"
                labelProps={{ className: "mb-2" }}
                w="500px"
                placeholder="Enter Your Password"
              />
              {}
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
                label="Password Confirmation"
                name="confirmpassword"
                error={formErrors?.passwordConfirmation}
                onChange={handleChange}
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
                className="transition-all hover:opacity-90"
                mt={20}
              >
                save new password
              </Button>
              {saveNewPassword && (
                <Button variant="outline">
                  <Link href={"/auth"} className="text-primary font-medium">
                    login again
                  </Link>
                </Button>
              )}
            </Flex>
          </form>
        </Flex>
      </Flex>
      <ToastContainer />
    </GridCol>
  );
}

export default ForgotPassword;
