import { Flex } from "@mantine/core";

function Login({ onSwitch }: { onSwitch: () => void }) {
  return (
    <Flex align="center" justify="center">
      <p>
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-text font-extrabold hover:text-primary"
        >
          Sign In
        </button>
      </p>
    </Flex>
  );
}

export default Login;
