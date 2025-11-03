import { useCallback, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button, ButtonGroup, Modal, Row } from "react-bootstrap";

import { FaDownload, FaEye } from 'react-icons/fa';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf/pdf.worker.min.mjs`;

const options = {
  cMapUrl: './cmaps/',
  standardFontDataUrl: './standard_fonts/',
  wasmUrl: './wasm/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

export default function Sample(props) {
  const [file ] = useState(props.file);
  const [numPages, setNumPages] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const onResize = useCallback((entry) => {
    if (!entry) return;
    setContainerWidth(entry.contentRect.width);
  }, []);

  useResizeObserver(containerRef, onResize, resizeObserverOptions);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const onDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(file);

      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = props.filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // TODO: surface download errors to the user once we have a shared notification pattern.
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
            <>
            <Modal.Header closeButton>
            </Modal.Header>
            
            <Modal.Body className="wine-modal-body">

                <div className="Example">
                    <div className="Example__container__document" ref={setContainerRef}>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                        {Array.from(new Array(numPages || 0), (_el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                        />
                        ))}
                    </Document>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Button className='col m-1' variant="success" onClick={() => {window.open(props.file, '_blank', 'noopener,noreferrer')}}>
                    <FaEye /> View PDF
                </Button>
                <Button
                    className='col m-1'
                    variant="success"
                    onClick={onDownload}
                    disabled={isDownloading}
                >
                    <FaDownload /> Download PDF
                </Button>
              </Row>
            </Modal.Footer>
        </>
  );
}
