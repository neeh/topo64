import { arrayCopy, arrayFill, arrayMax } from './util.js';

let DEV = true;

// Taken from Google Draco 3D Mesh Compression lib.
// See https://github.com/google/draco/blob/master/src/draco/mesh/corner_table.h
//
// CornerTable is used to represent connectivity of triangular meshes.
// For every corner of all faces, the corner table stores the index of the
// opposite corner in the neighboring face (if it exists) as illustrated in the
// figure below (see corner |c| and it's opposite corner |o|).
//
//     *
//    /c\
//   /   \
//  /n   p\
// *-------*
//  \     /
//   \   /
//    \o/
//     *
//
// All corners are defined by unique CornerIndex and each triplet of corners
// that define a single face id always ordered consecutively as:
//     { 3 * FaceIndex, 3 * FaceIndex + 1, 3 * FaceIndex +2 }.
// This representation of corners allows CornerTable to easily retrieve Next and
// Previous corners on any face (see corners |n| and |p| in the figure above).
// Using the Next, Previous, and Opposite corners then enables traversal of any
// 2-manifold surface.
// If the CornerTable is constructed from a non-manifold surface, the input
// non-manifold edges and vertices are automatically split.
//
export class CornerTable {
  constructor() {
    // corner index -> vertex index
    this.cornerToVertex = [];
    // corner index -> opposite corner index
    this.oppositeCorner = [];
    // vertex index -> corner index
    this.vertexCorners = [];

    this.originalVertexCount = 0;
    this.degeneratedFaceCount = 0;
    this.isolatedVertexCount = 0;

    this.nonManifoldVertexParent = [];

    this.valenceCache = null; // TODO
  }

  initEmpty(numFaces) {
    arrayFill(this.cornerToVertex, -1, numFaces * 3);
    arrayFill(this.oppositeCorner, -1, numFaces * 3);
  }

  // Initializes the CornerTable from provides set of indexed faces.
  // The input faces can represent a non-manifold topology, in which case the
  // non-manifold edges and vertices are going to be split.
  init(faces) {
    arrayCopy(faces, this.cornerToVertex);
    this.computeOppositeCorners();
    // this.breakNonManifoldEdges();
    // this.computeVertexCorners();
  }

  numVertices() {
    return this.vertexCorners.length;
  }

  numCorners() {
    return this.cornerToVertex.length;
  }

  numFaces() {
    return Math.floor(this.cornerToVertex.length / 3);
  }

  opposite(cornerId) {
    if (cornerId === -1) return -1;
    return this.oppositeCorner[cornerId];
  }

  next(cornerId) {
    if (cornerId === -1) return -1;
    return (cornerId + 1) % 3 !== 0 ? cornerId + 1 : cornerId - 2;
  }

  previous(cornerId) {
    if (cornerId === -1) return -1;
    return cornerId % 3 !== 0 ? cornerId - 1 : cornerId + 2;
  }

  oppositeNext(cornerId) {
    if (cornerId === -1) return -1;
    cornerId = this.oppositeCorner[cornerId];
    if (cornerId === -1) return -1;
    return (cornerId + 1) % 3 !== 0 ? cornerId + 1 : cornerId - 2;
  }

  oppositePrev(cornerId) {
    if (cornerId === -1) return -1;
    cornerId = this.oppositeCorner[cornerId];
    if (cornerId === -1) return -1;
    return cornerId % 3 !== 0 ? cornerId - 1 : cornerId + 2;
  }

  vertex(cornerId) {
    if (cornerId === -1) return -1; // optional
    return this.cornerToVertex[cornerId];
  }

  nextVertex(cornerId) {
    if (cornerId === -1) return -1;
    cornerId = (cornerId + 1) % 3 !== 0 ? cornerId + 1 : cornerId - 2;
    return this.cornerToVertex[cornerId];
  }

  prevVertex(cornerId) {
    if (cornerId === -1) return -1;
    cornerId = cornerId % 3 !== 0 ? cornerId - 1 : cornerId + 2;
    return this.cornerToVertex[cornerId];
  }

  face(cornerId) {
    if (cornerId === -1) return -1;
    return Math.floor(cornerId / 3);
  }

  firstCorner(faceId) {
    if (faceId === -1) return -1;
    return faceId * 3;
  }

  allCorners(faceId) {
    const cornerId = faceId * 3;
    return [cornerId, cornerId + 1, cornerId + 2];
  }

  faceData(faceId) {
    const cornerId = faceId * 3;
    const faceData = [];
    for (let i = 0; i < 3; ++i) {
      faceData[i] = this.cornerToVertex[cornerId + i];
    }
    return faceData;
  }

  setFaceData(faceId, faceData) {
    const cornerId = faceId * 3;
    for (let i = 0; i < 3; ++i) {
      this.cornerToVertex[cornerId + i] = faceData[i];
    }
  }

  // Returns the left-most corner of a single vertex 1-ring. If a vertex is not
  // on a boundary (in which case it has a full 1-ring), this function returns
  // any of the corners mapped to the given vertex.
  leftMostCorner(vertexId) {
    return this.vertexCorners[vertexId];
  }

  // Returns the parent vertex index of a given corner table vertex.
  vertexParent(vertexId) {
    if (vertexId < this.originalVertexCount) return vertexId;
    return this.nonManifoldVertexParent[vertexId - this.originalVertexCount];
  }

  // Returns true if the corner is valid.
  isValid(cornerId) {
    return this.cornerToVertex[cornerId] !== -1;
  }

  // Returns the valence (or degree) of a vertex.
  // Returns -1 if the given vertex index is not valid.
  valenceOfVertex(vertexId) {

  }

  valenceOfCorner(cornerId) {
    if (cornerId === -1) return -1; // optional
    return this.valenceOfVertex(this. cornerToVertex[cornerId]);
  }

  isOnBoundary(vertexId) {
    const cornerId = this.leftMostCorner(vertexId);
    return this.swingLeft(cornerId) === -1;
  }

  //     *-------*
  //    / \     / \
  //   /   \   /   \
  //  /   sl\c/sr   \
  // *-------v-------*
  // Returns the corner on the adjacent face on the right that maps to
  // the same vertex as the given corner (sr in the above diagram).
  swingRight(cornerId) {
    return this.previous(this.opposite(this.previous(cornerId)));
  }

  // Returns the corner on the left face that maps to the same vertex as the
  // given corner (sl in the above diagram).
  swingLeft(cornerId) {
    return this.next(this.opposite(this.next(cornerId)));
  }

  // Get opposite corners on the left and right faces respectively (see image
  // below, where L and R are the left and right corners of a corner X.
  //
  // *-------*-------*
  //  \L    /X\    R/
  //   \   /   \   /
  //    \ /     \ /
  //     *-------*
  getLeftCorner(cornerId) {
    if (cornerId === -1) return -1;
    // return this.opposite(this.previous(cornerId));
    cornerId = cornerId % 3 !== 0 ? cornerId - 1 : cornerId + 2;
    return this.oppositeCorner[cornerId];
  }

  getRightCorner(cornerId) {
    if (cornerId === -1) return -1;
    // return this.opposite(this.next(cornerId));
    cornerId = (cornerId + 1) % 3 !== 0 ? cornerId + 1 : cornerId - 2;
    return this.oppositeCorner[cornerId];
  }

  // Returns the number of new vertices that were created as a result of
  // splitting of non-manifold vertices of the input geometry.
  numNewVertices() {
    return this.vertexCorners.length - this.originalVertexCount;
  }

  isDegenerated(faceId) {
    if (faceId === -1) return true;
    const cornerId = faceId * 3;
    const v0 = this.cornerToVertex[cornerId];
    const v1 = this.cornerToVertex[cornerId + 1];
    const v2 = this.cornerToVertex[cornerId + 2];
    return v0 === v1 || v0 === v2 || v1 === v2;
  }

  setOppositeCorner(cornerId, oppositeCornerId) {
    this.oppositeCorner[cornerId] = oppositeCornerId;
  }

  setOppositeCorners(corner0, corner1) {
    if (corner0 !== -1) this.oppositeCorner[corner0] = corner1;
    if (corner1 !== -1) this.oppositeCorner[corner1] = corner0;
  }

  setOppositeCornersImm(corner0, corner1) {
    this.oppositeCorner[corner0] = corner1;
    this.oppositeCorner[corner1] = corner0;
  }

  mapCornerToVertex(cornerId, vertexId) {
    this.cornerToVertex[cornerId] = vertexId;
  }

  addNewVertex() {
    this.vertexCorners.push(-1);
    return this.vertexCorners.length - 1;
  }

  // Adds a new face connected to three vertices. Note that connectivity is not
  // automatically updated and all opposite corners need to be set explicitly.
  addNewFace(vertices) {
    const faceId = Math.floor(this.cornerToVertex.length / 3);
    for (let i = 0; i < 3; ++i) {
      this.cornerToVertex.push(vertices[i]);
      this.oppositeCorner.push(-1);
      this.setLeftMostCorner(vertices[i], this.cornerToVertex.length - 1);
    }
    return faceId;
  }

  setLeftMostCorner(vertexId, cornerId) {
    if (vertexId !== -1) {
      this.vertexCorners[vertexId] = cornerId;
    }
  }

  // Updates the vertex to corner map on a specified vertex. This should be
  // called in cases where the mapping may be invalid (e.g. when the corner
  // table was constructed manually).
  updateVertexToCornerMap(vertexId) {
    const firstCornerId = this.vertexCorners[vertexId];
    if (cornerId === -1) return;
    // Here we are basically looking for the left most corner, if it exist
    let curCornerId = this.swingLeft(firstCornerId);
    let cornerId = firstCornerId;
    while (curCornerId !== -1 && curCornerId !== firstCornerId) {
      cornerId = curCornerId;
      curCornerId = this.swingLeft(curCornerId);
    }
    // the left most corner might not exist in a full 1-ring
    if (curCornerId !== firstCornerId) {
      this.vertexCorners[vertexId] = cornerId;
    }
  }

  // Sets the new number of vertices. It's a responsibility of the caller to
  // ensure that no corner is mapped beyond the range of the new number of
  // vertices.
  setNumVertices(numVertices) {
    const initialLength = this.vertexCorners.length;
    this.vertexCorners.length = numVertices;
    for (let i = initialLength; i < numVertices; ++i) {
      this.vertexCorners[i] = -1;
    }
  }

  // Makes a vertex isolated (not attached to any corner).
  makeVertexIsolated(vertexId) {
    this.vertexCorners[vertexId] = -1;
  }

  // Returns true if a vertex is not attached to any face.
  isVertexIsolated(vertexId) {
    return this.vertexCorners[vertexId] === -1;
  }

  // Makes a given face invalid (all corners are marked as invalid).
  makeFaceInvalid(faceId) {
    if (faceId !== -1) {
      const cornerId = faceId * 3;
      for (let i = 0; i < 3; ++i) {
        this.cornerToVertex[cornerId + i] = -1;
      }
    }
  }

  // Updates mapping between faces and a vertex using the corners mapped to
  // the provided vertex.
  updateFaceToVertexMap(vertexId) {

  }

  // Computes opposite corners mapping from the data stored in
  // |corner_to_vertex_map_|.
  computeOppositeCorners() {
    // Our implementation for finding opposite corners is based on keeping track
    // of outgoing half-edges for each vertex of the mesh. Half-edges (defined by
    // their opposite corners) are processed one by one and whenever a new
    // half-edge (corner) is processed, we check whether the sink vertex of
    // this half-edge contains its sibling half-edge. If yes, we connect them and
    // remove the sibling half-edge from the sink vertex, otherwise we add the new
    // half-edge to its source vertex.

    const numCorners = this.cornerToVertex.length;
    const numVertices = arrayMax(this.cornerToVertex) + 1;

    arrayFill(this.oppositeCorner, -1, numCorners);

    // First compute the number of outgoing half-edges (corners) attached to each
    // vertex. For each corner there is always exactly one outgoing half-edge attached
    // to its vertex.
    const numCornersPerVertex = [];
    arrayFill(numCornersPerVertex, 0, numVertices);
    for (let i = 0; i < numCorners; ++i) {
      numCornersPerVertex[this.cornerToVertex[i]]++;
    }

    // Create a storage for half-edges on each vertex. We store all half-edges in
    // one array, where each entry is identified by the half-edge's sink vertex id
    // and the associated half-edge corner id (corner opposite to the half-edge).
    // Each vertex will be assigned storage for up to
    // |num_corners_on_vertices[vert_id]| half-edges. Unused half-edges are marked
    // with |sink_vert| == kInvalidVertexIndex.
    const vertexEdgeSink = [];
    const vertexEdgeCorner = [];
    arrayFill(vertexEdgeSink, -1, numCorners);
    arrayFill(vertexEdgeCorner, -1, numCorners);

    // For each vertex compute the offset (location where the first half-edge
    // entry of a given vertex is going to be stored). This way each vertex is
    // guaranteed to have a non-overlapping storage with respect to the other
    // vertices.
    const vertexOffset = [];
    let offset = 0;
    for (let i = 0; i < numVertices; ++i) {
      vertexOffset[i] = offset;
      offset += numCornersPerVertex[i];
    }

    // Now go over the all half-edges (using their opposite corners) and either
    // insert them to the |vertex_edge| array or connect them with existing
    // half-edges.
    for (let i = 0; i < numCorners; ++i) {
      const tipId = this.cornerToVertex[i];
      const sourceId = this.cornerToVertex[this.next(i)];
      const sinkId = this.cornerToVertex[this.previous(i)];

      // TODO: Improve this by re-writing the loop
      const faceId = Math.floor(i / 3);
      if (i === faceId * 3) {
        if (tipId === sourceId || tipId === sinkId || sourceId === sinkId) {
          this.numDegeneratedFaces++;
          i += 2; // Ignore the next two corners of the same face.
          continue;
        }
      }

      let oppositeCornerId = -1;

      const numCornersOnSink = numCornersPerVertex[sinkId];
      offset = vertexOffset[sinkId];
      for (let j = 0; j < numCornersOnSink; ++j, ++offset) {
        const otherId = vertexEdgeSink[offset];
        if (otherId === -1) {
          break; // No matching half-edge found on the sink vertex.
        }
        if (otherId === sourceId) {
          if (tipId === this.cornerToVertex[vertexEdgeCorner[offset]]) {
            continue; // Don't connect mirrored faces.
          }
          // A matching half-edge was found on the sink vertex. Mark the
          // half-edge's opposite corner.
          oppositeCornerId = vertexEdgeCorner[offset];
          // Remove the half-edge from the sink vertex. We remap all subsequent
          // half-edges one slot down.
          // TODO(ostava): This can be optimized a little bit, by remapping only
          // the half-edge on the last valid slot into the deleted half-edge's
          // slot.
          for (let k = j + 1; k < numCornersOnSink; ++k, ++offset) {
            vertexEdgeSink[offset] = vertexEdgeSink[offset + 1];
            vertexEdgeCorner[offset] = vertexEdgeCorner[offset + 1];
            if (vertexEdgeSink[offset] === -1) {
              break; // Unused half-edge reached.
            }
          }
          // Mark the last entry as unused.
          vertexEdgeSink[offset] = -1;
          break;
        }
      }
      if (oppositeCornerId === -1) {
        // No opposite corner found. Insert the new edge
        const numCornersOnSource = numCornersPerVertex[sourceId];
        offset = vertexOffset[sourceId];
        for (let j = 0; j < numCornersOnSource; ++j, ++offset) {
          // Find the first unused half-edge slot on the source vertex.
          if (vertexEdgeSink[offset] === -1) {
            vertexEdgeSink[offset] = sinkId;
            vertexEdgeCorner[offset] = i;
            break;
          }
        }
      } else {
        // Opposite corner found.
        this.oppositeCorner[i] = oppositeCornerId;
        this.oppositeCorner[oppositeCornerId] = i;
      }
    }

    return true;
  }

  // Finds and breaks non-manifold edges in the 1-ring neighborhood around
  // vertices (vertices themselves will be split in the ComputeVertexCorners()
  // function if necessary).
  breakNonManifoldEdges() {
    // This function detects and breaks non-manifold edges that are caused by
    // folds in 1-ring neighborhood around a vertex. Non-manifold edges can occur
    // when the 1-ring surface around a vertex self-intersects in a common edge.
    // For example imagine a surface around a pivot vertex 0, where the 1-ring
    // is defined by vertices |1, 2, 3, 1, 4|. The surface passes edge <0, 1>
    // twice which would result in a non-manifold edge that needs to be broken.
    // For now all faces connected to these non-manifold edges are disconnected
    // resulting in open boundaries on the mesh. New vertices will be created
    // automatically for each new disjoint patch in the ComputeVertexCorners()
    // method.
    // Note that all other non-manifold edges are implicitly handled by the
    // function ComputeVertexCorners() that automatically creates new vertices
    // on disjoint 1-ring surface patches.

    const numCorners = this.cornerToVertex.length;

    const visitedCorners = [];
    arrayFill(visitedCorners, false, numCorners);
    let sinkVerticesLength = 0;
    const sinkVerticesFirst = [];
    const sinkVerticesSecond = [];

    let meshConnectivityUpdated = false;
    do {
      meshConnectivityUpdated = false;
      for (let i = 0; i < numCorners; ++i) {
        if (visitedCorners[i]) {
          continue;
        }
        sinkVerticesLength = 0;

        // First swing all the way to find the left-most corner connected to the
        // corner's vertex.
        let firstCorner = i;
        let curCorner = i;
        let nextCorner;
        while (nextCorner = this.swingLeft(curCorner),
          nextCorner !== firstCorner && nextCorner !== -1 && !visitedCorners[nextCorner]) {
          curCorner = nextCorner;
        }

        firstCorner = curCorner;

        // Swing right from the first corner and check if all visited edges
        // are unique.
        do {
          visitedCorners[curCorner] = true;
          // Each new edge is defined by the pivot vertex (that is the same for
          // all faces) and by the sink vertex (that is the |next| vertex from the
          // currently processed pivot corner. I.e., each edge is uniquely defined
          // by the sink vertex index.
          const sinkCorner = this.next(curCorner);
          const sinkVertex = this.cornerToVertex[sinkCorner];

          // Corner that defines the edge on the face.
          const edgeCorner = this.previous(curCorner);
          let vertexConnectivityUpdated = false;
          // Go over all processed edges (sink vertices). If the current sink
          // vertex has been already encountered before it may indicate a
          // non-manifold edge that needs to be broken.
          for (let j = 0; j < sinkVerticesLength; ++j) {
            const attachedSinkVertexFirst = sinkVerticesFirst[j];
            const attachedSinkVertexSecond = sinkVerticesSecond[j];

            if (attachedSinkVertexFirst === sinkVertex) {
              // Sink vertex has already been processed.
              const otherEdgeCorner = attachedSinkVertexSecond;
              if (DEV && edgeCorner === -1) throw new Error('Invalid edgeCorner');
              const oppEdgeCorner = this.oppositeCorner[edgeCorner];

              if (oppEdgeCorner === otherEdgeCorner) {
                // We are closing the loop so no need to change the connectivity.
                continue;
              }

              // Break the connectivity on the non-manifold edge.
              // TODO(ostava): It may be possible to reconnect the faces in a way
              // that the final surface would be manifold.
              if (DEV && otherEdgeCorner === -1) throw new Error('Invalid otherEdgeCorner');
              const oppOtherEdgeCorner = this.oppositeCorner[otherEdgeCorner];
              if (oppEdgeCorner !== -1) {
                this.oppositeCorner[oppEdgeCorner] = -1;
              }
              if (oppOtherEdgeCorner !== -1) {
                this.oppositeCorner[oppOtherEdgeCorner] = -1;
              }

              this.oppositeCorner[edgeCorner] = -1;
              this.oppositeCorner[otherEdgeCorner] = -1;

              vertexConnectivityUpdated = true;
              break;
            }
          }
          if (vertexConnectivityUpdated) {
            // Because of the updated connectivity, not all corners connected to
            // this vertex have been processed and we need to go over them again.
            // TODO(ostava): This can be optimized as we don't really need to
            // iterate over all corners.
            meshConnectivityUpdated = true;
            break;
          }
          // Insert new sink vertex information <sink vertex index, edge corner>.
          sinkVerticesFirst[sinkVerticesLength] = this.cornerToVertex[edgeCorner];
          // NOTE: This is correct since edgeCorner = this.previous(curCorner); ^
          sinkVerticesSecond[sinkVerticesLength] = sinkCorner;
          sinkVerticesLength++;

          curCorner = this.swingRight(curCorner);
        } while (curCorner !== firstCorner && curCorner !== -1);
      }
    } while (meshConnectivityUpdated);

    return true;
  }

  // Computes the lookup map for going from a vertex to a corner. This method
  // can handle non-manifold vertices by splitting them into multiple manifold
  // vertices.
  computeVertexCorners() {
    const numCorners = this.cornerToVertex.length;
    let numVertices = arrayMax(this.cornerToVertex) + 1;

    this.originalVertexCount = numVertices;
    arrayFill(this.vertexCorners, -1, numVertices);

    // Arrays for marking visited vertices and corners that allow us to detect
    // non-manifold vertices.
    const visitedVertices = [];
    const visitedCorners = [];
    arrayFill(visitedVertices, false, numVertices);
    arrayFill(visitedCorners, false, numCorners);

    const il = this.cornerToVertex.length / 3 | 0;
    for (let i = 0; i < il; ++i) {
      // Check whether the face is degenerated. If so ignore it.
      if (this.isDegenerated(i)) {
        continue;
      }
      const firstCorner = i * 3;

      // NOTE: Could be rewritten:
      // for (let end = j + 3; j < end; ++j) {
      for (let j = 0; j < 3; ++j) {
        const corner = firstCorner + j;
        if (visitedCorners[corner]) {
          continue;
        }
        let vertex = this.cornerToVertex[corner];
        // Note that one vertex maps to many corners, but we just keep track
        // of the vertex which has a boundary on the left if the vertex lies on
        // the boundary. This means that all the related corners can be accessed
        // by iterating over the SwingRight() operator.
        // In case of a vertex inside the mesh, the choice is arbitrary.
        let isNonManifoldVertex = false;
        if (visitedVertices[vertex]) {
          // A visited vertex of an unvisited corner found. Must be a non-manifold
          // vertex.
          // Create a new vertex for it.
          this.vertexCorners.push(-1);
          this.nonManifoldVertexParent.push(vertex);
          visitedVertices.push(false);
          vertex = numVertices++;
          isNonManifoldVertex = true;
        }
        // Mark the vertex as visited.
        visitedVertices[vertex] = true;

        // First swing all the way to the left and mark all corners on the way.
        let curCorner = corner;
        while (curCorner !== -1) {
          visitedCorners[curCorner] = true;
          // Vertex will eventually point to the left most corner.
          this.vertexCorners[vertex] = curCorner;
          if (isNonManifoldVertex) {
            // Update vertex index in the corresponding face.
            this.cornerToVertex[curCorner] = vertex;
          }
          curCorner = this.swingLeft(curCorner);
          if (curCorner === corner) {
            break; // Full circle reached.
          }
        }
        if (curCorner === -1) {
          // If we have reached an open boundary we need to swing right from the
          // initial corner to mark all corners in the opposite direction.
          curCorner = this.swingRight(corner);
          while (curCorner !== -1) {
            visitedCorners[curCorner] = true;
            if (isNonManifoldVertex) {
              // Update vertex index in the corresponding face.
              this.cornerToVertex[curCorner] = vertex;
            }
            curCorner = this.swingRight(curCorner);
          }
        }
      }
    }

    // Count the number of isolated (unprocessed) vertices.
    this.isolatedVertexCount = 0;
    for (let i = 0; i < numVertices; ++i) {
      if (!visitedVertices[i]) {
        this.isolatedVertexCount++;
      }
    }

    return true;
  }
}
