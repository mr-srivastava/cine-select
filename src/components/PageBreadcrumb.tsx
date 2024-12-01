import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function PageBreadcrumb(props: {
  breadcrumbs: { link: string; label: string; isActive: boolean }[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {props.breadcrumbs.map((breadcrumb) => {
          return (
            <BreadcrumbItem key={breadcrumb.link}>
              {breadcrumb.isActive ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <>
                <BreadcrumbLink href={breadcrumb.link}>
                  {breadcrumb.label}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
