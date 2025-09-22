"use client";

import { useState } from "react";

import { Plus, Users, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeachersQuery } from "@/store/api/teacher-api";

import { TeacherForm } from "./_components/teacher-form";
import { TeacherList } from "./_components/teacher-list";

export default function TeachersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: teachers = [] } = useGetTeachersQuery();

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage teachers and their assignments</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-muted-foreground text-xs">Active teachers in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Divisions</CardTitle>
            <GraduationCap className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(teachers.map((t) => t.division)).size}</div>
            <p className="text-muted-foreground text-xs">Different divisions covered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(teachers.map((t) => t.class)).size}</div>
            <p className="text-muted-foreground text-xs">Different classes covered</p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers List */}
      <TeacherList />

      {/* Add Teacher Modal */}
      <TeacherForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />
    </div>
  );
}
