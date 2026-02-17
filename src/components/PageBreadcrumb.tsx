import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export interface BreadcrumbEntry {
  link: string;
  label: string;
  isActive: boolean;
}

export interface PageBreadcrumbProps {
  breadcrumbs: BreadcrumbEntry[];
}

export default function PageBreadcrumb({ breadcrumbs }: PageBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <Fragment key={breadcrumb.link}>
              <BreadcrumbItem key={breadcrumb.link}>
                {breadcrumb.isActive ? (
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={breadcrumb.link}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  </>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
