"use client";

import { useState } from "react";

import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";
import { useGetTeachersQuery, useDeleteTeacherMutation } from "@/store/api/teacher-api";
import type { Teacher } from "@/types/teacher";

export function TeacherList() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const { data: teachers = [], isLoading, error, refetch } = useGetTeachersQuery();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id).unwrap();
        toast.success("Teacher deleted successfully!");
        refetch();
      } catch (error: unknown) {
        const errorMessage = (error as any)?.data?.message ?? (error as any)?.message ?? "Failed to delete teacher";
        toast.error("Error", {
          description: errorMessage,
        });
      }
    }
  };

  const handleEdit = (_teacher: Teacher) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-2">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load teachers</p>
          <Button onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No teachers found</p>
          <p className="text-muted-foreground mt-1 text-sm">Add your first teacher to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
          <CardDescription>Manage all teachers in your school</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Division {teacher.division}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Class {teacher.class}</Badge>
                  </TableCell>
                  <TableCell>{teacher.phone ?? "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(teacher)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(teacher.id)}
                          className="text-destructive"
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle>Teacher Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(selectedTeacher.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedTeacher.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    Division {selectedTeacher.division} - Class {selectedTeacher.class}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Phone:</span>
                  <p className="text-muted-foreground text-sm">{selectedTeacher.phone ?? "Not provided"}</p>
                </div>
              </div>

              <Button onClick={() => setSelectedTeacher(null)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
