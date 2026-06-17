"use client";

import AddRequestModal from "@/components/AddRequestModal";
import RequestCard from "@/components/RequestCard";
import { useRequestStore } from "@/store/Requests";
import { useUserStore } from "@/store/user";
import {
  Button,
  Divider,
  Flex,
  Grid,
  GridCol,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdOutlineSearch } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const AllKinds = ["All", "leave", "overTime", "remoteWork", "loan"];
const AllStatuses = ["All", "pending", "approved", "rejected"];

function Requests() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKind, setSelectedKind] = useState("All");
  const [selectedRequestStatus, setSelectedRequestStatus] = useState("All");
  const [opened, { open, close }] = useDisclosure();
  const { requests, getUserRequests } = useRequestStore();
  const { currentUser } = useUserStore();
  const router = useRouter();

  // userRequests

  // filtered Requests;
  const filteredRequests = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    const userRequests = getUserRequests(currentUser?.id as string);

    return userRequests.filter((r) => {
      const reason = "reason" in r ? r.reason.toLowerCase() : "";
      const searchMatches =
        r.managerNote.toLowerCase().includes(searchTerm) ||
        reason.includes(searchTerm);

      const filteredMaches =
        selectedKind === "All" ? requests : r.kind === selectedKind;

      const filteredStatus =
        selectedRequestStatus === "All"
          ? requests
          : r.requestStatus === selectedRequestStatus;

      return searchMatches && filteredMaches && filteredStatus;
    });
  }, [selectedKind, searchQuery, selectedRequestStatus]);

  // see Request
  const seeRequest = (id: string) => {
    router.push(`/dashboard/my-requests/${id}`);
  };

  return (
    <>
      <Flex
        direction={"column"}
        gap={24}
        className="sticky top-0 p-6 z-30 bg-white rounded-3xl  overflow-y-auto"
      >
        <Flex justify={"space-between"}>
          <h1 className="text-2xl font-semibold ">My Requests</h1>
          {currentUser?.role !== "Manager" && (
            <Button onClick={open} className="!font-medium">
              + Add Request
            </Button>
          )}
        </Flex>
        {/* divider */}
        <Divider />
        <Flex direction={"column"} gap={16}>
          <TextInput
            type="search"
            onChange={(e) => setSearchQuery(e.target.value)}
            radius={12}
            size="md"
            leftSection={<MdOutlineSearch size={20} />}
            placeholder="Search By Word"
            className="w-[100%]"
          />
          <Flex gap={20}>
            {currentUser?.role !== "Manager" &&
              AllKinds.map((kind, i) => (
                <Button
                  variant={selectedKind === kind ? "filled" : "outline"}
                  value={kind}
                  radius={"md"}
                  key={i}
                  onClick={() => setSelectedKind(kind)}
                >
                  {kind.charAt(0).toUpperCase() + kind.slice(1)}
                </Button>
              ))}
            {currentUser?.role === "Manager" &&
              AllStatuses.map((status, i) => (
                <Button
                  variant={
                    selectedRequestStatus === status ? "filled" : "outline"
                  }
                  value={status}
                  radius={"md"}
                  key={i}
                  onClick={() => setSelectedRequestStatus(status)}
                >
                  {status}
                </Button>
              ))}
          </Flex>
        </Flex>
        <AddRequestModal open={open} opened={opened} close={close} />
        <ToastContainer />
        {filteredRequests.length === 0 && (
          <Flex align={"center"} gap={12} justify={"center"}>
            {" "}
            <CiSearch size={24} color="#121212" />{" "}
            <Text> No Requests Found</Text>
          </Flex>
        )}
        <Grid columns={12} className="pb-6 pt-0">
          {filteredRequests.map((request) => (
            <GridCol span={4} key={request.createdAt}>
              <RequestCard request={request} seeRequest={seeRequest} />
            </GridCol>
          ))}
        </Grid>
      </Flex>
    </>
  );
}

export default Requests;
