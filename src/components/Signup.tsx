import { Flex } from "@mantine/core";

function SignUp({ onSwitch }: { onSwitch: () => void }) {
  return (
    <Flex align="center" justify="center">
      <p>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-text font-extrabold hover:text-primary"
        >
          Sign Up
        </button>
      </p>
    </Flex>
  );
}

export default SignUp;
