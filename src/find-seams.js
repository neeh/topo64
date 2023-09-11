import { CornerTable } from './topology/corner-table.js';
import { arrayFill, arrayMax } from './topology/util.js';

function createLineBuffers(cornerTable) {
  const { cornerToVertex, oppositeCorner } = cornerTable;
  const numCorners = cornerToVertex.length;

  const edgeIndices = [];
  const seamIndices = [];

  const visitedCorners = []; // corner -> edge visited or not
  arrayFill(visitedCorners, false, numCorners);

  // Visit each edge once and add it to either edges or seams
  for (let i = 0; i < numCorners; ++i) {
    if (visitedCorners[i]) continue;

    const oppCornerId = oppositeCorner[i];

    const indices = oppCornerId > -1 ? edgeIndices : seamIndices;

    const sourceId = cornerToVertex[cornerTable.next(i)];
    const sinkId = cornerToVertex[cornerTable.previous(i)];

    indices.push(sourceId, sinkId);

    visitedCorners[i] = true;
    if (oppCornerId > -1) {
      visitedCorners[oppCornerId] = true;
    }
  }

  return {
    edges: edgeIndices,
    seams: seamIndices
  };
}

export function findSeams(model) {
  const geometry = model.createGeometry();
  geometry.deduplicateAttributeValues();
  geometry.deduplicateVertices();

  const posIndex = geometry.getPositionConnectivity();
  console.log(arrayMax(posIndex));
  const cornerTable = new CornerTable();
  cornerTable.init(posIndex);

  const buffers = createLineBuffers(cornerTable);
  console.log(arrayMax(buffers.edges));
  console.log(arrayMax(buffers.seams));
  console.log(geometry.posAttribute.values);

  return {
    vertices: geometry.posAttribute.values,
    edges: buffers.edges,
    seams: buffers.seams
  };
}
