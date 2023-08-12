import { MenuItem } from "./ListItem";
import {
  mainRoutes,
  wilayahRoutes,
  putungRoutes,
  supportRoutes,
} from "components/routes";

export const MainList = ({ userLevel }) => {
  if (!userLevel) return <></>;
  return mainRoutes.map((item) => (
    <MenuItem key={item.title} item={item} userLevel={userLevel} />
  ));
};

export const WilayahList = ({ userLevel }) => {
  if (!userLevel) return <></>;
  return wilayahRoutes.map((item) => (
    <MenuItem key={item.title} item={item} userLevel={userLevel} />
  ));
};

export const PutungList = ({ userLevel }) => {
  if (!userLevel) return <></>;
  return putungRoutes.map((item) => (
    <MenuItem key={item.title} item={item} userLevel={userLevel} />
  ));
};

export const SupportList = ({ userLevel }) => {
  if (!userLevel) return <></>;
  return supportRoutes.map((item) => (
    <MenuItem key={item.title} item={item} userLevel={userLevel} />
  ));
};
