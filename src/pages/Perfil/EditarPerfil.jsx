import React, { useState } from "react";
import { updateUserDisplayNameInDatabase } from "../../firebase";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { toast } from "react-toastify";

const EditarPerfil = ({ open, setOpen, user, setUser }) => {
  const [newDisplayName, setNewDisplayName] = useState("");

  const handleOpen = async () => {
    try {
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

  return (
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Update profile
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            Edit Username
          </Typography>
          <Input
            label="Username"
            size="lg"
            value={newDisplayName}
            onChange={handleChange}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleOpen} fullWidth>
            Change
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

export default EditarPerfil;
