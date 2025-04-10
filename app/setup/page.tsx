"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Settings, Upload } from "lucide-react"
import { Source } from "unbody/admin"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-z0-9_]+$/, "Name can only contain lowercase letters, numbers, and underscores")
    .transform((val) => val.toLowerCase())
})

type FormValues = z.infer<typeof formSchema>

export default function SetupPage() {
  const [sources, setSources] = useState<Source[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      name: "",
    },
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/sources")
      if (response.status === 401) {
        setIsAuthenticated(false)
        toast({
          title: "Authentication Required",
          description: "Please enter your credentials to access this page.",
          variant: "destructive",
        })
      } else {
        setIsAuthenticated(true)
        fetchSources()
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      setIsAuthenticated(false)
    }
  }

  const fetchSources = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sources")
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          throw new Error("Authentication required")
        }
        throw new Error("Failed to fetch sources")
      }
      const data = await response.json()
      setSources(data)
    } catch (error) {
      console.error("Error fetching sources:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch sources. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) {
      toast({ title: "Error", description: "Image is required", variant: "destructive" });
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast({ title: "Error", description: "File must be an image", variant: "destructive" });
      return;
    }

    if (selectedFile.size > 5000000) {
      toast({ title: "Error", description: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("url", data.url);
      formData.append("file", selectedFile);

      const response = await fetch("/api/sources", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error("Authentication required");
        }
        if (response.status === 400) {
          const errors = result.details || [];
          errors.forEach((error: any) => {
            form.setError(error.path[0] as keyof FormValues, {
              type: "server",
              message: error.message,
            });
          });
          toast({
            title: "Validation Error",
            description: "Please check the form for errors.",
            variant: "destructive",
          });
        } else {
          throw new Error(result.error || "Failed to create source");
        }
      } else {
        form.reset();
        setSelectedFile(null);
        fetchSources();
        toast({
          title: "Success",
          description: "Source created successfully!",
        });
      }
    } catch (error) {
      console.error("Error creating source:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create source",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Please enter your credentials to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Source Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Name</FormLabel>
                    <FormControl>
                      <Input placeholder="my_website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Source Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-2">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-10 h-10 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedFile(null)}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Source"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : sources.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No sources found. Add a new source above.
            </p>
          ) : (
            <div className="space-y-4">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex flex-col gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {source.custom?.image && (
                        <img
                          src={source.custom.image}
                          alt={source.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex flex-col gap-2">
                        <p className="font-medium capitalize flex items-center gap-2">
                          {source.name}
                          <span className="text-xs text-muted-foreground rounded-full px-2 border border-muted-foreground">
                            {source.state}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {source.custom.entrypoint.url}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(source.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://app.unbody.io/projects/${source.projectId}/sources/${source.id}`}
                      target="_blank"
                      className="text-sm text-muted-foreground rounded-sm px-2 border border-muted-foreground py-1"
                    >
                      Logs
                    </a>
                    <Link
                      href={`/${source.name}`}
                      className="text-sm text-muted-foreground rounded-sm px-2 border border-muted-foreground py-1"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 