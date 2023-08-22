import { DeleteAPI } from "../fetchAPI";

const deleteUser = (userID: number) => {
  DeleteAPI(`/user?userId=${userID}`).then(res => {
    console.log(res.success);
  });
};

export default { deleteUser };
