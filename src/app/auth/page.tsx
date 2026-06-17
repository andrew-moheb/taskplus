"use client";

import {
  Button,
  Checkbox,
  Flex,
  GridCol,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import Image from "next/image";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import SignUp from "@/components/Signup";
import Login from "@/components/Login";
import Link from "next/link";

function UserAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRoles] = useState<string>("");
  const router = useRouter();
  const { signUp, isLoading, error, clearError, signIn, users } =
    useUserStore();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    role: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
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
    const errs: typeof formErrors = {};
    if (!formData.email) errs.email = "Email Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid Email";
    if (!formData.password) errs.password = "Passowrd Required";
    else if (formData.password.length < 6) errs.password = "Min 6 Characters";
    else if (!/[A-Z]/.test(formData.password))
      errs.password = "Must contain at least one uppercase letter";
    else if (!/[0-9]/.test(formData.password))
      errs.password = "Must contain at least one number";
    else if (!/[!@#$%^&*]/.test(formData.password))
      errs.password = "Must contain at least one special character";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    let success;
    e.preventDefault();
    if (!validate()) return;
    if (isLogin) {
      success = await signUp(
        formData.firstname,
        formData.lastname,
        role,
        formData.email,
        formData.password,
      );
    } else {
      success = await signIn(formData.email, formData.password);
    }
    if (success) router.push("/dashboard");
  };

  return (
    <GridCol
      span={6}
      className="bg-white flex justify-center pt-5  h-[calc(100vh-48px)] rounded-2xl"
    >
      <Flex
        gap={32}
        direction="column"
        className="w-[calc(100%-160px)]"
        align="center"
      >
        <Image width={100} height={75} src="/logo.png" unoptimized alt="Logo" />
        <Flex direction="column" align="center" justify="center" gap={32}>
          <Flex direction="column" align="center" justify="center" gap={4}>
            <h1 className="text-3xl">Welcome!</h1>
            <Text size="18px" fw={400} className="text-normal"></Text>
            <p>Please login to continue</p>
          </Flex>
          <form onSubmit={handleSubmit} noValidate>
            <Flex direction="column" gap={16} w={500}>
              {isLogin && (
                <Flex gap={12} w={500}>
                  <TextInput
                    styles={{
                      label: {
                        fontWeight: 500,
                        fontSize: "14px",
                        marginBottom: "8px",
                      },
                    }}
                    type="text"
                    label="First name"
                    withAsterisk
                    name="firstname"
                    onChange={handleChange}
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
                    withAsterisk
                    // error={formErrors?.email}
                    name="lastname"
                    onChange={handleChange}
                    labelProps={{ className: "mb-2" }}
                    size="md"
                    placeholder="ex: martin"
                  />
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
                    value={role}
                    label="Role"
                    name="role"
                    placeholder="ex: developer"
                    size="md"
                    onChange={(val) => setRoles(val ?? "")}
                    data={[`Developer`, "Designer", "Manager", "Tester"]}
                  />
                </Flex>
              )}
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
                error={formErrors?.email}
                name="email"
                onChange={handleChange}
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
              <PasswordInput
                styles={{
                  label: {
                    fontWeight: 500,
                    fontSize: "14px",
                    marginBottom: "8px",
                  },
                }}
                withAsterisk
                label="Password"
                name="password"
                error={formErrors?.password}
                onChange={handleChange}
                size="md"
                labelProps={{ className: "mb-2" }}
                w="100%"
                placeholder="Enter Your Password"
              />
              <Flex justify="space-between" align="center">
                <Checkbox defaultChecked label="Remember me" />
                <Link
                  href={"/auth/forgotpassword"}
                  className="hover:text-primary hover:font-normal text-text"
                >
                  {isLogin ? "" : "Forgot Password?"}
                </Link>
              </Flex>
              {error && <p className="text-red-500">{error}</p>}
              <Button
                loading={isLoading}
                loaderProps={{ type: "dots" }}
                disabled={isLoading}
                type="submit"
                variant="filled"
                size="md"
                mt={20}
                className="transition-all hover:opacity-90"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </Flex>
          </form>
          {isLogin ? (
            <Login onSwitch={() => setIsLogin(false)} />
          ) : (
            <SignUp onSwitch={() => setIsLogin(true)} />
          )}
        </Flex>
      </Flex>
    </GridCol>
  );
}

export default UserAuth;
