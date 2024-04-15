import React, { useState } from "react";
import { updateUserDisplayNameInDatabase } from "../../firebase";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Input,
} from "@material-tailwind/react";
import { toast } from "react-toastify";

const EditarPerfil = ({ open, setOpen, user, setUser }) => {
  const [newDisplayName, setNewDisplayName] = useState("");

  const handleSubmit = async () => {
    try {
      if (newDisplayName === "") {
        console.log("ere");
        toast.error("Username cannot be empty");
        setOpen((cur) => !cur);
        return;
      }
      await updateUserDisplayNameInDatabase(user.uid, newDisplayName);

      setUser({ ...user, displayName: newDisplayName });
      toast.success("Username updated successfully");
    } catch (error) {
      toast.error("Error updating display name. Try later");
      console.error("Error updating display name in database:", error);
    }
    setOpen((cur) => !cur);
  };
  const handleChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const h = () => {
    console.log("here");
    setOpen((cur) => !cur);
  };

  return (
    <Dialog
      size="xs"
      open={open}
      handler={() => setOpen((cur) => !cur)}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <p variant="h4" color="blue-gray">
            Update profile
          </p>
          <p className="mb-3 font-normal" variant="paragraph" color="gray">
            Edit Username
          </p>
          <Input
            label="Username"
            size="lg"
            value={newDisplayName}
            onChange={handleChange}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleSubmit} fullWidth>
            Change
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

export default EditarPerfil;
