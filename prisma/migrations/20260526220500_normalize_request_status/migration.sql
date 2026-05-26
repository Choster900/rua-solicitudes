-- Normalize legacy DesignRequest.status values (Spanish) to the new English flow codes
UPDATE "DesignRequest" SET "status" = 'PENDING_ASSIGNMENT' WHERE "status" = 'Borrador';
UPDATE "DesignRequest" SET "status" = 'IN_DESIGN'          WHERE "status" = 'En diseño';
UPDATE "DesignRequest" SET "status" = 'IN_QUALITY_REVIEW'  WHERE "status" = 'En revisión';
UPDATE "DesignRequest" SET "status" = 'APPROVED'           WHERE "status" = 'Aprobada';
